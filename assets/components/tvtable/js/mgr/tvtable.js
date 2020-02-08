function TableTV (id, config) {
    this.id = id;
    this.field = document.getElementById(id);
    for (key in config) {
        switch (key) {
            case 'drag':
                this[key] = (config[key] == 'true' || config[key] == 1) || false;
                break;
            case 'headers':
                this[key] = config[key].split('||');
                break;
            default:
                this[key] = config[key];
                break;
        }
    }
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
    var toolbar = TVTable.createElement('div', {class: 'tvt-toolbar'});
    var header = TVTable.createElement('div', {class: 'tvt-header'});

    this.elements = {
        editor: editor,
        header: header,
        toolbar: toolbar,
        addColumn: addColumnElement,
        removeColumn: removeColumnElement,
        clearTable: clearTableElement,
        rows: TVTable.createElement('div', {class: 'tvt-rows'}),
    }

    if (this.drag && typeof Sortable !== 'undefined') {
        var self = this;
        editor.classList.add('drag');
        Sortable.create(this.elements.rows, {
            filter: 'input',
            preventOnFilter: false,
            animation: 100,
            onEnd: function (e) {
                self.change();
            }
        });
    }

    this.addColumn = function(rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var inputs = row.querySelectorAll('.tvt-input-wrapper');
            TVTable.insertAfter(this.createCell(), inputs[inputs.length - 1]);
        }
        this.change();
    }

    this.createCell = function (value) {
        var wrapper = TVTable.createElement('span', {class: 'tvt-input-wrapper'});
        var cell = TVTable.createElement('input', {
            type: 'text',
            value: value || '',
            class: 'tvt-input x-form-text x-form-field',
        });
        cell.fieldObject = this;
        cell.onkeyup = function() {            
            if (MODx.config.tvtable_clear_button == 1) { this.fieldObject.elements.clearTable.style.display = 'inline-flex' }
            this.fieldObject.change();
        }
        if (this.width) cell.style.width = this.width + 'px';
        wrapper.appendChild(cell);
        return wrapper;
    }

    this.removeColumn = function(index) {
        var rows = this.elements.editor.querySelectorAll('.tvt-row');

        if (this.columns > 1) {
            var column = [];
            var values = [];
            
            for (var i = 0; i < this.rows; i++) {
                var row = rows[i];
                var inputs = row.querySelectorAll('.tvt-input-wrapper');

                if (index) {
                    column.push(inputs[index]);
                    values.push(inputs[index].querySelectorAll('input.tvt-input').value);
                } else {
                    column.push(inputs[inputs.length - 1]);
                    values.push(inputs[inputs.length - 1].querySelectorAll('input.tvt-input').value);
                }
            }

            if (MODx.config.tvtable_remove_confirm == 1 && TVTable.checkArray(values)) {
                var fieldObject = this;
                Ext.Msg.confirm(_('confirm'), _('tvtable.remove_column_confirm'), function(btn) {
                    if (btn === 'yes') {
                        fieldObject.removeColumnForce(column);
                    }
                });
            } else {
                this.removeColumnForce(column);
            }
        }
    }

    this.removeColumnForce = function(column) {
        column.forEach(function(el) {
            el.remove();
        });

        this.change();

        if (this.columns === 1) {
            this.elements.removeColumn.classList.add('disabled');
            this.elements.removeColumn.setAttribute('disabled', true);
            this.elements.editor.classList.add('locked');
        }

        if (this.forceCountColumns) {
            if (this.columns <= this.forceCountColumns) {
                this.elements.removeColumn.style.display = 'none';
                this.elements.editor.classList.add('locked');
            }
            if (this.columns == this.forceCountColumns) {
                if (this.elements.addColumn) this.elements.addColumn.style.display = 'none';
            }
        } else if (this.maxColumns >= 1 && this.columns < this.maxColumns) {
            this.elements.addColumn.classList.remove('disabled');
            this.elements.addColumn.disabled = false;
        }
    }

    this.addHeader = function() {
        this.elements.editor.appendChild(this.elements.header);
        this.elements.editor.appendChild(this.elements.rows);
        var columnsNotLimited = !this.forceCountColumns && !this.maxColumns;
        if (columnsNotLimited || typeof this.forceCountColumns !== 'undefined' && this.columns > this.forceCountColumns || typeof this.forceCountColumns === 'undefined' && typeof this.maxColumns !== 'undefined') {
            this.elements.removeColumn.fieldObject = this;
            this.elements.toolbar.appendChild(this.elements.removeColumn);
            if (this.columns < 2) {
                this.elements.removeColumn.classList.add('disabled');
                this.elements.removeColumn.setAttribute('disabled', true);
                this.elements.editor.classList.add('locked');
            }
            this.elements.removeColumn.onclick = function() {
                this.fieldObject.removeColumn();
            };
        } else {
            this.elements.editor.classList.add('locked');
        }
        if (columnsNotLimited || typeof this.forceCountColumns !== 'undefined' && this.columns < this.forceCountColumns || typeof this.forceCountColumns === 'undefined' && typeof this.maxColumns !== 'undefined' && this.maxColumns > 1) {
            this.elements.addColumn.fieldObject = this;
            this.elements.toolbar.appendChild(this.elements.addColumn);
            if (this.columns >= this.maxColumns && !this.forceCountColumns) {
                this.elements.addColumn.classList.add('disabled');
                this.elements.addColumn.setAttribute('disabled', true);
            }
            this.elements.addColumn.onclick = function() {
                var columns = this.fieldObject.elements.editor.querySelector('.tvt-row').querySelectorAll('input.tvt-input').length+1;
                var rows = this.fieldObject.elements.editor.querySelectorAll('.tvt-row');
                if (columns > 1 && this.fieldObject.elements.removeColumn.classList.contains('disabled')) {
                    this.fieldObject.elements.removeColumn.classList.remove('disabled');
                    this.fieldObject.elements.removeColumn.removeAttribute('disabled');
                    this.fieldObject.elements.editor.classList.remove('locked');
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
            this.elements.toolbar.appendChild(this.elements.clearTable);
            this.elements.clearTable.onclick = function () {
                var fieldObject = this.fieldObject;
                if (MODx.config.tvtable_remove_confirm == 1) {
                    Ext.Msg.confirm(_('confirm'), _('tvtable.clear_table_confirm'), function(btn) {
                        if (btn === 'yes') {
                            fieldObject.clearTable();
                        }
                    });
                } else {
                    fieldObject.clearTable();
                }
            }
        }
    }

    this.clearTable = function() {
        var inputs = this.elements.editor.querySelectorAll('input.tvt-input');
        inputs.forEach(function(e){e.value = ''});
        if (MODx.config.tvtable_clear_button == 1) { this.elements.clearTable.style.display = 'none' }
        this.change();
    }

    this.createAddRow = function (disabled) {
        var addRow = TVTable.createElement('button', {
            title: _('tvtable.add_row')
            ,class: 'add-row x-btn x-btn-small tvt-button primary-button' + (disabled ? ' disabled' : '')
        });
        if (disabled) {
            addRow.setAttribute('disabled', true);
        }
        addRow.appendChild(TVTable.createElement('i', {
            class: 'icon icon-plus'
        }));
        addRow.fieldObject = this;
        addRow.onclick = function() {
            var row = this.parentNode;
            var columns = this.fieldObject.columns;
            var maxRows = this.fieldObject.maxRows;

            this.fieldObject.elements.editor.querySelectorAll('.remove-row').forEach(function(el) {
                el.classList.remove('disabled');
                el.removeAttribute('disabled');
            });

            if (maxRows > 1) {
                if (this.fieldObject.rows < maxRows) {
                    this.fieldObject.addRow(columns, row);
                    this.fieldObject.change();
                }
                if (this.fieldObject.rows >= maxRows) {
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
            var row = this.parentNode;
            var fieldObject = this.fieldObject;
            if (MODx.config.tvtable_remove_confirm == 1) {
                var rowsEmpty = true;
                row.querySelectorAll('input.tvt-input').forEach(function(e) {
                    if (e.value != '') { rowsEmpty = false }
                });
                if (!rowsEmpty) {
                    Ext.Msg.confirm(_('confirm'), _('tvtable.remove_row_confirm'), function(btn) {
                        if (btn === 'yes') {
                            fieldObject.removeRow(row);
                        }
                    });
                } else {
                    fieldObject.removeRow(row);
                }
            } else {
                fieldObject.removeRow(row);
            }
        }

        return removeRow;
    }

    this.removeRow = function (row) {
        row.remove();
        this.change();

        if (typeof this.maxRows != 'undefined' && this.maxRows > 0 && this.rows < this.maxRows) {
            this.elements.editor.querySelectorAll('.add-row').forEach(function(button){
                button.classList.remove('disabled');
                button.removeAttribute('disabled');
            });
        }

        if (this.rows <= 1) {
            this.elements.editor.querySelectorAll('.remove-row').forEach(function(button){
                button.classList.add('disabled');
                button.setAttribute('disabled', true);
            });
        }

        if (typeof this.forceCountRows !== 'undefined' && this.rows <= this.forceCountRows) {
            this.elements.editor.querySelectorAll('.remove-row').forEach(function(button){
                button.remove();
            });
        }
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
            handle.setAttribute('draggable', true);
            handle.fieldObject = this;
            rowDiv.appendChild(handle);
        }

        if (row) {
            TVTable.insertAfter(rowDiv, row);
        } else {
            this.elements.rows.appendChild(rowDiv);
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
    
    this.update = function() {
        var deleteColumns = this.elements.header.querySelectorAll('.tvt-tmp');
        if (deleteColumns.length > 0) {
            deleteColumns.forEach(function(el) {
                el.remove();
            });
        }
        
        var firstRow = this.elements.rows.querySelector('.tvt-row');
        var wrappers = firstRow.querySelectorAll('.tvt-input-wrapper');

        for (var index = 0; index < wrappers.length; index++) {
            var wrapper = wrappers[index];
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
                var buttons = this.fieldObject.elements.header.querySelectorAll('.tvt-delete-column');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].dataset.columnIndex = i;
                }
                if (Ext.isArray(this.fieldObject.headers)) {
                    var headerElements = this.fieldObject.elements.header.querySelectorAll('.tvt-headers');
                    for (var i = 0; i < this.columns; i++) {
                        var header = this.fieldObject.headers[i] || this.fieldObject.headersDefault || '';
                        headerElements[i].innerText = header;
                        headerElements[i].setAttribute('title', header);
                    }
                }
            }
            var tmp = TVTable.createElement('div', {
                class: 'tvt-tmp'
            });
            if (this.width) tmp.style.width = (this.width + 16) + 'px';
            if (Ext.isArray(this.headers)) {
                var header = TVTable.createElement('span', {class: 'tvt-headers', title: this.headers[index] || ''});
                header.innerText = this.headers[index] || this.headersDefault || '';
                tmp.appendChild(header);
            }
            tmp.appendChild(deleteColumn);
            this.elements.header.appendChild(tmp);
        }
    }

    this.change = function () {
        this.update();
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
        for (var row = 0; row < this.rows; row++) {
            this.addRow(this.value[row], null, disabled, withoutAddButton, withoutRemoveButton);
        }
        this.update();
    }
    
    this.init();
    this.elements.editor.appendChild(this.elements.toolbar);
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