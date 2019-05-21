function TableTV (id) {
    this.id = id;
    this.field = document.getElementById(id);
    this.forceCountColumns = this.field.dataset.columns;
    this.maxColumns = this.field.dataset.maxColumns;
    this.maxRows = this.field.dataset.maxRows;
    this.value = this.field.value ? Ext.util.JSON.decode(this.field.value) : new Array(Array.from({length: this.columns || this.forceCountColumns || 1}));
    this.elements = {
        editor: TVTable.insertAfter(TVTable.createElement('div', {class: 'tvtEditor'}), this.field),
        addColumn: TVTable.createElement('input', {
            type: 'button'
            ,value: '\uF054'
            ,title: _('tvtable.add_column')
            ,class: 'add-column x-btn x-btn-small tvt-button primary-button'
        }),
        removeColumn: TVTable.createElement('input', {
            type: 'button'
            ,value: '\uf053'
            ,title: _('tvtable.del_column')
            ,class: 'remove-column x-btn x-btn-small tvt-button tvt-button-danger'
        }),
        clearTable: TVTable.createElement('input', {
            type: 'button'
            ,value: '\uf021'
            ,title: _('tvtable.clear_table')
            ,class: 'clear-table x-btn x-btn-small tvt-button tvt-button-warning'
            ,style: TVTable.checkArray(this.value) ? 'display: inline-flex;' : 'display: none;'
        }),
        header: TVTable.createElement('div', {class: 'tvt-row tvt-header'}),
    }
    this.addColumn = function(rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var inputs = row.querySelectorAll('input.tvt-input');
            TVTable.insertAfter(this.createCell(''), inputs[inputs.length - 1])
        }
        this.change();
    }
    this.createCell = function (value) {
        var wrapper = TVTable.createElement('span', {class: 'tvt-input-wrapper'});
        var cell = TVTable.createElement('input', {
            type: 'text'
            ,value: value ? value : ''
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
        wrapper.appendChild(cell);
        return wrapper;
    }
    this.addHeader = function() {
        this.elements.editor.appendChild(this.elements.header);
        for (var i = 0; i < this.columns; i++) {
            this.elements.header.appendChild(this.createCell(this.header[i]));
        }
        this.elements.header.appendChild(this.createAddRow((this.rows >= this.maxRows ? true : false)));

        var columnsNotLimited = !this.forceCountColumns && !this.maxColumns;
        if (columnsNotLimited || typeof this.forceCountColumns !== 'undefined' && this.columns > this.forceCountColumns || typeof this.forceCountColumns === 'undefined' && typeof this.maxColumns !== 'undefined') {
            this.elements.removeColumn.fieldObject = this;
            this.elements.header.appendChild(this.elements.removeColumn);
            if (this.columns < 2) {
                this.elements.removeColumn.classList.add('disabled');
                this.elements.removeColumn.setAttribute('disabled', true);
            }
            this.elements.removeColumn.onclick = function () {
                var columns = this.fieldObject.elements.header.querySelectorAll('input.tvt-input').length;
                var rows = this.fieldObject.elements.editor.querySelectorAll('.tvt-row');

                if (columns > 1) {
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var inputs = row.querySelectorAll('input.tvt-input');
                        inputs[inputs.length - 1].remove();
                    }
                    this.fieldObject.change();
                    columns--;
                }

                if (columns === 1) {
                    this.classList.add('disabled');
                    this.setAttribute('disabled', true);
                }

                var maxColumns = this.fieldObject.maxColumns;
                var countColumns = this.fieldObject.forceCountColumns;

                if (countColumns) {
                    if (columns <= countColumns) {
                        this.style.display = 'none';
                    }
                    if (columns == countColumns) {
                        if (this.fieldObject.elements.addColumn) this.fieldObject.elements.addColumn.style.display = 'none';
                    }
                } else if (maxColumns >= 1 && columns < maxColumns) {
                    this.fieldObject.elements.addColumn.classList.remove('disabled');
                    this.fieldObject.elements.addColumn.disabled = false;
                }
            }
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
                }

                var maxColumns = this.fieldObject.maxColumns;
                var countColumns = this.fieldObject.forceCountColumns;
                if (countColumns) {
                    if (columns >= countColumns) {
                        this.style.display = 'none';
                    }
                    if (columns == countColumns) {
                        this.fieldObject.addColumn(rows);
                        if (this.fieldObject.elements.removeColumn) this.fieldObject.elements.removeColumn.style.display = 'none';
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
        var addRow = TVTable.createElement('input', {
            type: 'button'
            ,value: '\uf067'
            ,title: _('tvtable.add_row')
            ,class: 'add-row x-btn x-btn-small tvt-button primary-button' + (disabled ? ' disabled' : '')
        });
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
        var removeRow = TVTable.createElement('input', {
            type: 'button'
            ,value: '\uf068'
            ,title: _('tvtable.del_row')
            ,class: 'remove-row x-btn x-btn-small tvt-button tvt-button-danger'
        });
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
        }

        return removeRow;
    }
    this.addRow = function(values, row, disabled) {
        var rowDiv = TVTable.createElement('div', {class: 'tvt-row'});
        if (row) {
            TVTable.insertAfter(rowDiv, row);
        } else {
            this.elements.editor.appendChild(rowDiv);
        }
        
        if (typeof values == 'number') {
            for (var i = 0; i < values; i++) {
                rowDiv.appendChild(this.createCell(''));
            }
        } else {
            for (var i = 0; i < values.length; i++) {
                rowDiv.appendChild(this.createCell((values) ? values[i] : ''));
            }
        }
        rowDiv.appendChild(this.createAddRow(disabled));        
        rowDiv.appendChild(this.createRemoveRow());
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
        TVTable.TVs[this.id].value = this.value = value;
        MODx.fireResourceFormChange();
    }
    this.init = function () {
        this.field.style.display = 'none';
        if (this.value[0].length < this.columns) {
            var diff = this.columns - tvtArr[0].length;
            tvtArr.forEach(function(column) {
                for (var i = 0; i < diff; i++) {
                    column.push('');
                }
            });
        }
        this.rows = this.value.length;
        this.header = this.value[0];
        this.columns = this.header.length;
        this.addHeader();
        for (var row = 1; row < this.rows; row++) {
            this.addRow(this.value[row], null, (this.rows >= this.maxRows ? true : false));
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