function TableTV (id) {
    this.id = id;
    this.field = document.getElementById(id);
    this.drag = (this.field.dataset.drag == 'true') || false;
    this.width = this.field.dataset.width;
    this.forceCountRows = this.field.dataset.rows;
    this.forceCountColumns = this.field.dataset.columns;
    this.maxColumns = this.field.dataset.maxColumns;
    this.maxRows = this.field.dataset.maxRows;
    this.headersDefault = this.field.dataset.headersDefault;
    this.headers = this.field.dataset.headers ? this.field.dataset.headers.split('||') : '';
    if (this.field.value) {
        this.value = Ext.util.JSON.decode(this.field.value);
    } else {
        var value = Array.from({length: this.rows || this.forceCountRows || 1}); // rows
        if (value && value.length > 0) {
            for (var i = 0; i < value.length; i++) {
                value[i] = Array.from({length: this.columns || this.forceCountColumns || 1});
            }
        }
        this.value = value;
    }
    var addColumnElement = TVTable.createElement('button', {
        title: _('tvtable.add_column')
        ,class: 'add-column x-btn x-btn-small tvt-button primary-button'
    });
    addColumnElement.appendChild(TVTable.createElement('i', {class: 'icon icon-chevron-right'}));
    var removeColumnElement = TVTable.createElement('button', {
        title: _('tvtable.del_column')
        ,class: 'remove-column x-btn x-btn-small tvt-button tvt-button-danger'
    });
    removeColumnElement.appendChild(TVTable.createElement('i', {class: 'icon icon-chevron-left'}));
    var clearTableElement = TVTable.createElement('button', {
        title: _('tvtable.clear_table')
        ,class: 'clear-table x-btn x-btn-small tvt-button tvt-button-warning'
        ,style: TVTable.checkArray(this.value) ? 'display: inline-flex;' : 'display: none;'
    });
    clearTableElement.appendChild(TVTable.createElement('i', {class: 'icon icon-refresh'}));
    var editor = TVTable.insertAfter(TVTable.createElement('div', {class: 'tvtEditor'}), this.field);
    if (this.drag) { editor.classList.add('drag') }
    this.elements = {
        editor: editor,
        addColumn: addColumnElement,
        removeColumn: removeColumnElement,
        clearTable: clearTableElement,
        header: TVTable.createElement('div', {class: 'tvt-row tvt-header'}),
    }
    this.Drag = {
        handleDrag: function(item) {
            var selectedItem = item.target.closest('.tvt-row'),
                list = selectedItem.parentNode,
                x = event.clientX,
                y = event.clientY;

            selectedItem.classList.add('drag-active');
            var swapItem = (document.elementFromPoint(x, y).classList.contains('tvt-row') ? document.elementFromPoint(x, y) : document.elementFromPoint(x, y).closest('.tvt-row')) || selectedItem;

            if (list === swapItem.closest('.tvtEditor') && !swapItem.closest('.tvt-row').classList.contains('tvt-header')) {
                swapItem = swapItem !== selectedItem.nextSibling ? swapItem.closest('.tvt-row') : swapItem.closest('.tvt-row').nextSibling;
                list.insertBefore(selectedItem, swapItem);
                this.fieldObject.change();
            }
        },
        handleDrop: function(item) {
            item.target.closest('.tvt-row').classList.remove('drag-active');
        }
    }
    this.addColumn = function(rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var inputs = row.querySelectorAll('.tvt-input-wrapper');
            if (i == 0) {
                TVTable.insertAfter(this.createCell('', true, inputs.length), inputs[inputs.length - 1]);
            } else {
                TVTable.insertAfter(this.createCell(), inputs[inputs.length - 1]);
            }
        }
        this.change();
    }
    this.createCell = function (value, isHeader, index) {
        var wrapper = TVTable.createElement('span', {class: 'tvt-input-wrapper'});
        var cell = TVTable.createElement('input', {
            type: 'text'
            ,value: value || ''
            ,class: 'tvt-input x-form-text x-form-field'
        });
        cell.fieldObject = this;
        cell.onkeyup = function() {            
            if (MODx.config.tvtable_clear_button == 1) {
                var clearBtn = this.fieldObject.elements.editor.querySelector('.clear-table');
                clearBtn.style.display = 'inline-flex';
            }
            this.fieldObject.change();
        }
        if (isHeader) {
            var deleteColumn = TVTable.createElement('span', {class: 'tvt-delete-column'});
            deleteColumn.fieldObject = this;
            deleteColumn.dataset['columnIndex'] = index;
            if (typeof this.width === 'undefined' || this.width > 120) {
                deleteColumn.innerText = _('tvtable.del_column');
            } else {
                deleteColumn.classList.add('tvt-delete-column-sm');
                deleteColumn.innerText = '\u2716';
                deleteColumn.setAttribute('title', _('tvtable.del_column'));
            }
            deleteColumn.onclick = function() {
                this.fieldObject.removeColumn(this.dataset.columnIndex);
                var buttons = this.fieldObject.elements.editor.querySelectorAll('.tvt-header .tvt-delete-column');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].dataset.columnIndex = i;
                }
                if (Ext.isArray(this.fieldObject.headers)) {
                    var columns = this.fieldObject.elements.editor.querySelectorAll('.tvt-header .tvt-input-wrapper');
                    var headerElements = this.fieldObject.elements.editor.querySelectorAll('.tvt-header .tvt-headers');
                    for (var i = 0; i < columns.length; i++) {
                        var header = this.fieldObject.headers[i] || this.fieldObject.headersDefault || '';
                        headerElements[i].innerText = header;
                        headerElements[i].setAttribute('title', header);
                    }
                }
            }
            if (Ext.isArray(this.headers)) {
                var header = TVTable.createElement('span', {class: 'tvt-headers', title: this.headers[index] || ''});
                header.innerText = this.headers[index] || this.headersDefault || '';
                wrapper.appendChild(header);
            }
            wrapper.appendChild(deleteColumn);
        }
        if (this.width) cell.style.width = this.width + 'px';
        wrapper.appendChild(cell);
        return wrapper;
    }
    this.removeColumn = function(index) {
        var columns = this.elements.header.querySelectorAll('input.tvt-input').length;
        var rows = this.elements.editor.querySelectorAll('.tvt-row');

        if (columns > 1) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var inputs = row.querySelectorAll('.tvt-input-wrapper');

                if (index) {
                    inputs[index].remove();
                } else {
                    inputs[inputs.length - 1].remove();
                }
            }
            this.change();
            columns--;
        }

        if (columns === 1) {
            this.elements.removeColumn.classList.add('disabled');
            this.elements.removeColumn.setAttribute('disabled', true);
            this.elements.header.classList.add('locked');
        }

        var maxColumns = this.maxColumns;
        var countColumns = this.forceCountColumns;

        if (countColumns) {
            if (columns <= countColumns) {
                this.elements.removeColumn.style.display = 'none';
                this.elements.header.classList.add('locked');
            }
            if (columns == countColumns) {
                if (this.elements.addColumn) this.elements.addColumn.style.display = 'none';
            }
        } else if (maxColumns >= 1 && columns < maxColumns) {
            this.elements.addColumn.classList.remove('disabled');
            this.elements.addColumn.disabled = false;
        }
    }
    this.addHeader = function() {
        this.elements.editor.appendChild(this.elements.header);
        for (var i = 0; i < this.columns; i++) {
            this.elements.header.appendChild(this.createCell(this.header[i], true, i));
        }
        var rowsNotLimited = !this.forceCountRows && !this.maxRows;
        if (rowsNotLimited || typeof this.forceCountRows !== 'undefined' && this.rows < this.forceCountRows || typeof this.forceCountRows === 'undefined' && typeof this.maxRows !== 'undefined' && this.maxRows > this.rows) {
            this.elements.header.appendChild(this.createAddRow((this.rows >= this.maxRows ? true : false)));
        }

        var columnsNotLimited = !this.forceCountColumns && !this.maxColumns;
        if (columnsNotLimited || typeof this.forceCountColumns !== 'undefined' && this.columns > this.forceCountColumns || typeof this.forceCountColumns === 'undefined' && typeof this.maxColumns !== 'undefined') {
            this.elements.removeColumn.fieldObject = this;
            this.elements.header.appendChild(this.elements.removeColumn);
            if (this.columns < 2) {
                this.elements.removeColumn.classList.add('disabled');
                this.elements.removeColumn.setAttribute('disabled', true);
                this.elements.header.classList.add('locked');
            }
            this.elements.removeColumn.onclick = function() {
                this.fieldObject.removeColumn();
            };
        } else {
            this.elements.header.classList.add('locked');
        }
        if (columnsNotLimited || typeof this.forceCountColumns !== 'undefined' && this.columns < this.forceCountColumns || typeof this.forceCountColumns === 'undefined' && typeof this.maxColumns !== 'undefined' && this.maxColumns > 1) {
            this.elements.addColumn.fieldObject = this;
            this.elements.header.appendChild(this.elements.addColumn);
            if (this.columns >= this.maxColumns && !this.forceCountColumns) {
                this.elements.addColumn.classList.add('disabled');
                this.elements.addColumn.setAttribute('disabled', true);
            }
            this.elements.addColumn.onclick = function() {
                var columns = this.fieldObject.elements.header.querySelectorAll('input.tvt-input').length+1;
                var rows = this.fieldObject.elements.editor.querySelectorAll('.tvt-row');
                if (columns > 1 && this.fieldObject.elements.removeColumn.classList.contains('disabled')) {
                    this.fieldObject.elements.removeColumn.classList.remove('disabled');
                    this.fieldObject.elements.removeColumn.removeAttribute('disabled');
                    this.fieldObject.elements.header.classList.remove('locked');
                }

                var maxColumns = this.fieldObject.maxColumns;
                var countColumns = this.fieldObject.forceCountColumns;
                if (countColumns) {
                    if (columns >= countColumns) {
                        this.style.display = 'none';
                    }
                    if (columns == countColumns) {
                        this.fieldObject.addColumn(rows);
                        if (this.fieldObject.elements.removeColumn) this.fieldObject.elements.removeColumn.remove();
                        this.fieldObject.elements.editor.querySelectorAll('.tvt-delete-column').remove();
                    }
                } else if (maxColumns || maxColumns > 0) {
                    if (columns >= maxColumns) {
                        this.classList.add('disabled');
                        this.disabled = true;
                    }
                    if (columns <= maxColumns) {
                        this.fieldObject.addColumn(rows);
                    }
                } else {
                    this.fieldObject.addColumn(rows);
                }
            }
        }
        if (MODx.config.tvtable_clear_button == 1) {
            this.elements.clearTable.fieldObject = this;
            this.elements.header.appendChild(this.elements.clearTable);
            this.elements.clearTable.onclick = function () {
                var that = this;
                Ext.Msg.confirm(_('tvtable.clear_table'), _('tvtable.clear_table_confirm'), function(btn) {
                    if (btn === 'yes') {
                        var inputs = that.fieldObject.elements.editor.querySelectorAll('input.tvt-input');
                        inputs.forEach(function(e){e.value = ''});
                        if (MODx.config.tvtable_clear_button == 1) {that.style.display = 'none' }
                        that.fieldObject.change();
                    }
                });
            }
        }
    }
    this.createAddRow = function (disabled) {
        var addRow = TVTable.createElement('button', {
            title: _('tvtable.add_row')
            ,class: 'add-row x-btn x-btn-small tvt-button primary-button' + (disabled ? ' disabled' : '')
        });
        addRow.appendChild(TVTable.createElement('i', {
            class: 'icon icon-plus'
        }));
        addRow.fieldObject = this;
        addRow.onclick = function() {
            var row = this.parentNode;
            var columns = this.fieldObject.columns;
            var maxRows = this.fieldObject.maxRows;
            var rows = this.fieldObject.elements.editor.querySelectorAll('.tvt-row');

            if (maxRows > 1) {
                if (rows.length < maxRows) {
                    this.fieldObject.addRow(columns, row);
                    this.fieldObject.change();
                }
                if ((rows.length+1) >= maxRows) {
                    this.fieldObject.elements.editor.querySelectorAll('.add-row').forEach(function(button){
                        button.classList.add('disabled');
                        button.setAttribute('disabled', true);
                    });
                }
            } else {
                this.fieldObject.addRow(columns, row);
                this.fieldObject.change();
            }
        }

        return addRow;
    }
    this.createRemoveRow = function () {
        var removeRow = TVTable.createElement('button', {
            title: _('tvtable.del_row')
            ,class: 'remove-row x-btn x-btn-small tvt-button tvt-button-danger'
        });
        removeRow.appendChild(TVTable.createElement('i', {
            class: 'icon icon-minus'
        }));
        removeRow.fieldObject = this;
        removeRow.onclick = function() {
            var parent = this.parentNode;
            parent.remove();
            this.fieldObject.change();
    
            var maxRows = this.fieldObject.maxRows;
            var rows = this.fieldObject.elements.editor.querySelectorAll('.tvt-row');
    
            if (maxRows > 1 && rows.length < maxRows) {
                this.fieldObject.elements.editor.querySelectorAll('.add-row').forEach(function(button){
                    button.classList.remove('disabled');
                    button.removeAttribute('disabled');
                });
            }

            if (typeof this.fieldObject.forceCountRows !== 'undefined' && rows.length <= this.fieldObject.forceCountRows) {
                this.fieldObject.elements.editor.querySelectorAll('.remove-row').forEach(function(button){
                    button.remove();
                });
            }
        }

        return removeRow;
    }
    this.addRow = function(values, row, disabled, withoutAddButton, withoutRemoveButton) {
        var rowDiv = TVTable.createElement('div', {class: 'tvt-row'});
        if (this.drag) {
            var handle = TVTable.createElement('span', {class: 'tvt-handle'});
            for (var i = 0; i < 3; i++) {
                var handleDot = TVTable.createElement('span', {class: 'tvt-handle-dot'});
                handleDot.innerText = '..';
                handle.appendChild(handleDot);
            }
            handle.ondrag = this.Drag.handleDrag;
            handle.ondragend = this.Drag.handleDrop;
            handle.setAttribute('draggable', true);
            handle.fieldObject = this;
            rowDiv.appendChild(handle);
        }

        if (row) {
            TVTable.insertAfter(rowDiv, row);
        } else {
            this.elements.editor.appendChild(rowDiv);
        }
        
        if (typeof values == 'number') {
            for (var i = 0; i < values; i++) {
                rowDiv.appendChild(this.createCell());
            }
        } else {
            for (var i = 0; i < values.length; i++) {
                rowDiv.appendChild(this.createCell(values[i]));
            }
        }
        if (!withoutAddButton) rowDiv.appendChild(this.createAddRow(disabled));
        if (!withoutRemoveButton) rowDiv.appendChild(this.createRemoveRow());
    }
    this.change = function () {
        var tvtArr = new Array();
        var rows = this.elements.editor.querySelectorAll('.tvt-row');
        for (var x = 0; x < rows.length; x++) {
            var itemsArr = new Array();
            var inputs = rows[x].querySelectorAll('input.tvt-input');
            for (var y = 0; y < inputs.length; y++) {
                var item = inputs[y];
                itemsArr.push(item.value);
            }
            tvtArr.push(itemsArr);
        }
        this.rows = tvtArr.length;
        this.columns = tvtArr[0].length;
        var value;
        if (TVTable.checkArray(tvtArr)) {
            this.field.value = value = JSON.stringify(tvtArr);
        } else {
            if (MODx.config.tvtable_clear_button == 1) {
                this.elements.clearTable.style.display = 'none';
            }
            this.field.value = value = '';
        }
        this.header = tvtArr[0];
        TVTable.TVs[this.id].value = this.value = value;
        MODx.fireResourceFormChange();
    }
    this.init = function () {
        this.field.style.display = 'none';
        this.columns = this.value[0].length;
        this.rows = this.value.length;
        if (typeof this.forceCountColumns !== 'undefined' && this.columns < this.forceCountColumns) {
            var columnDiff = this.forceCountColumns - this.columns;
            this.value.forEach(function(column) {
                for (var i = 0; i < columnDiff; i++) {
                    column.push('');
                }
            });
            this.columns = this.columns + columnDiff;
        }
        if (typeof this.forceCountRows !== 'undefined' && this.rows < this.forceCountRows) {
            var rowDiff = this.forceCountRows - this.rows;
            for (var i = 0; i < rowDiff; i++) {
                this.value.push(Array.from({length: this.columns}));
            }
            this.rows = this.rows + rowDiff;
        }
        this.header = this.value[0];
        this.addHeader();
        var withoutAddButton = (typeof this.forceCountRows !== 'undefined' && this.rows >= this.forceCountRows) ? true : false;
        var withoutRemoveButton = (typeof this.forceCountRows !== 'undefined' && this.rows <= this.forceCountRows) ? true : false;
        var disabled = this.rows >= this.maxRows ? true : false;
        for (var row = 1; row < this.rows; row++) {
            this.addRow(this.value[row], null, disabled, withoutAddButton, withoutRemoveButton);
        }
    }

    this.init();
    TVTable.TVs[id] = this;
}

var TVTable = {
    createElement: function (type, attributes, disabled) {
        var element = document.createElement(type);
        for (key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        if (disabled) { element.setAttribute('disabled', true); }

        return element;
    }
    ,checkArray: function(array) {
        if (!Ext.isArray(array)) return false;

        for (var x = 0; x < array.length; x++) {
            var value = array[x];
            if (Ext.isArray(value)) {
                for (var y = 0; y < value.length; y++) {
                    if (value[y]) {
                        return true;
                    }
                }
            } else if (value) {
                return true;
            }
        }
        
        return false;
    }
    ,insertAfter: function (elem, refElem) {
        var parent = refElem.parentNode;
        var next = refElem.nextSibling;

        if (next) {
            return parent.insertBefore(elem, next);
        } else {
            return parent.appendChild(elem);
        }
    }
    ,TVs: {}
}