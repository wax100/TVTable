class TableTV {
    constructor(id, config = {}) {
        this.id = id;
        this.field = document.getElementById(id);
        this.TVs = {};

        for (let key in config) {
            switch (key) {
                case 'headers':
                    this['_' + key] = config[key];
                    break;
                default:
                    this[key] = config[key];
                    break;
            }
        }

        if (this.field.value) {
            this.value = Ext.util.JSON.decode(this.field.value);
        } else {
            let value = Array.from({length: this.rows || this.forceCountRows || 1}); // rows
            if (value && value.length > 0) {
                let values = value.map(() => {
                    return value[i] = Array.from({length: this.columns || this.forceCountColumns || 1});
                });
                this.value = values;
            }
        }

        let addColumn = TableTV.createElement('button', {
            title: _('tvtable.add_column')
            ,class: 'add-column x-btn x-btn-small tvt-button primary-button'
        });
        addColumn.appendChild(TableTV.createElement('i', {class: 'icon icon-chevron-right'}));
    
        let removeColumn = TableTV.createElement('button', {
            title: _('tvtable.del_column')
            ,class: 'remove-column x-btn x-btn-small tvt-button tvt-button-danger'
        });
        removeColumn.appendChild(TableTV.createElement('i', {class: 'icon icon-chevron-left'}));
    
        let clearTable = TableTV.createElement('button', {
            title: _('tvtable.clear_table')
            ,class: 'clear-table x-btn x-btn-small tvt-button tvt-button-warning'
            ,style: TableTV.checkArray(this.value) ? 'display: inline-flex;' : 'display: none;'
        });
        clearTable.appendChild(TableTV.createElement('i', {class: 'icon icon-refresh'}));
        
        let editor = TableTV.insertAfter(TableTV.createElement('div', {class: 'tvtEditor'}), this.field),
            toolbar = TableTV.createElement('div', {class: 'tvt-toolbar'}),
            header = TableTV.createElement('div', {class: 'tvt-header'});
    
        this.elements = {
            editor,
            toolbar,
            header,
            addColumn,
            removeColumn,
            clearTable,
            rows: TableTV.createElement('div', {class: 'tvt-rows'}),
        }
    
        if (this.drag && typeof Sortable !== 'undefined') {
            editor.classList.add('drag');
            Sortable.create(this.elements.rows, {
                filter: 'input',
                preventOnFilter: false,
                animation: 100,
                onEnd: () => {
                    this.change();
                }
            });
        }

        this.field.style.display = 'none';
        this.columns = this.value[0].length;
        this.rows = this.value.length;

        if (typeof this.forceCountColumns !== 'undefined' && this.columns < this.forceCountColumns) {
            let columnDiff = this.forceCountColumns - this.columns;
            this.value.forEach(column => {
                for (let i = 0; i < columnDiff; i++) {
                    column.push('');
                }
            });
            this.columns = this.columns + columnDiff;
        }

        if (typeof this.forceCountRows !== 'undefined' && this.rows < this.forceCountRows) {
            let rowDiff = this.forceCountRows - this.rows;
            for (let i = 0; i < rowDiff; i++) {
                this.value.push(Array.from({length: this.columns}));
            }
            this.rows = this.rows + rowDiff;
        }

        this.header = this.value[0];
        this.addHeader();

        let withoutAddButton = (typeof this.forceCountRows !== 'undefined' && this.rows >= this.forceCountRows) ? true : false;
        let withoutRemoveButton = (typeof this.forceCountRows !== 'undefined' && this.rows <= this.forceCountRows) ? true : false;
        let disabled = this.rows >= this.maxRows ? true : false;
    
        for (var row = 0; row < this.rows; row++) {
            this.addRow(this.value[row], null, disabled, withoutAddButton, withoutRemoveButton);
        }

        this.update();
        this.elements.editor.appendChild(this.elements.toolbar);
        this.TVs[id] = this;
    }

    addColumn(rows) {
        rows.forEach(row => {
            let inputs = this.getInputsWrappers(row);
            TableTV.insertAfter(this.createCell(), inputs[inputs.length - 1]);
        });
        this.change();
    }

    createCell(value = '') {
        let wrapper = TableTV.createElement('span', {class: 'tvt-input-wrapper'}),
            cell = TableTV.createElement('input', {
                type: 'text',
                value: value,
                class: 'tvt-input x-form-text x-form-field',
            });

        cell.addEventListener('keyup', e => {
            if (MODx.config.tvtable_clear_button == 1) { this.elements.clearTable.style.display = 'inline-flex' }
            this.change();
        });

        if (this.width) cell.style.width = this.width + 'px';
        wrapper.appendChild(cell);
        return wrapper;
    }

    removeColumn(index) {
        let rows = this.getRows();

        if (this.columns > 1) {
            let column = new Array(),
                values = new Array();

            rows.forEach(row => {
                let inputs = this.getInputsWrappers(row);

                if (index) {
                    column.push(inputs[index]);
                    values.push(this.getInputs(inputs[index]).value);
                } else {
                    column.push(inputs[inputs.length - 1]);
                    values.push(this.getInputs(inputs[inputs.length - 1]).value);
                }
            });

            if (MODx.config.tvtable_remove_confirm == 1 && TableTV.checkArray(values)) {
                Ext.Msg.confirm(_('confirm'), _('tvtable.remove_column_confirm'), btn => btn === 'yes' ? this.removeColumnForce(column) : '');
            } else {
                this.removeColumnForce(column);
            }
        }
    }

    removeColumnForce(column) {
        column.forEach(el => el.remove());

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

    addHeader() {
        this.elements.editor.appendChild(this.elements.header);
        this.elements.editor.appendChild(this.elements.rows);

        let columnsNotLimited = !this.forceCountColumns && !this.maxColumns;
        if (columnsNotLimited || typeof this.forceCountColumns !== 'undefined' && this.columns > this.forceCountColumns || typeof this.forceCountColumns === 'undefined' && typeof this.maxColumns !== 'undefined') {
            this.elements.toolbar.appendChild(this.elements.removeColumn);
            if (this.columns < 2) {
                this.elements.removeColumn.classList.add('disabled');
                this.elements.removeColumn.setAttribute('disabled', true);
                this.elements.editor.classList.add('locked');
            }
            this.elements.removeColumn.addEventListener('click', e => {
                this.removeColumn();
            });
        } else {
            this.elements.editor.classList.add('locked');
        }

        if (columnsNotLimited || typeof this.forceCountColumns !== 'undefined' && this.columns < this.forceCountColumns || typeof this.forceCountColumns === 'undefined' && typeof this.maxColumns !== 'undefined' && this.maxColumns > 1) {
            this.elements.toolbar.appendChild(this.elements.addColumn);

            if (this.columns >= this.maxColumns && !this.forceCountColumns) {
                this.elements.addColumn.classList.add('disabled');
                this.elements.addColumn.setAttribute('disabled', true);
            }

            this.elements.addColumn.addEventListener('click', e => {
                let target = e.currentTarget,
                    columns = this.getInputs(this.getRow()).length+1,
                    rows = this.getRows();

                if (columns > 1 && this.elements.removeColumn.classList.contains('disabled')) {
                    this.elements.removeColumn.classList.remove('disabled');
                    this.elements.removeColumn.removeAttribute('disabled');
                    this.elements.editor.classList.remove('locked');
                }

                if (this.forceCountColumns) {
                    if (columns >= this.forceCountColumns) {
                        target.style.display = 'none';
                    }
                    if (columns == this.forceCountColumns) {
                        this.addColumn(rows);
                        if (this.elements.removeColumn) this.elements.removeColumn.remove();
                        this.getColumnDeleteButtons().remove();
                    }
                } else if (this.maxColumns || this.maxColumns > 0) {
                    if (columns >= this.maxColumns) {
                        target.classList.add('disabled');
                        target.disabled = true;
                    }
                    if (columns <= this.maxColumns) {
                        this.addColumn(rows);
                    }
                } else {
                    this.addColumn(rows);
                }
            });
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

    clearTable() {
        let inputs = this.getInputs(this.elements.editor);
        inputs.forEach(e => e.value = '');
        if (MODx.config.tvtable_clear_button == 1) { this.elements.clearTable.style.display = 'none' }
        this.change();
    }

    createAddRow(disabled) {
        let addRow = TableTV.createElement('button', {
            title: _('tvtable.add_row')
            ,class: 'add-row x-btn x-btn-small tvt-button primary-button' + (disabled ? ' disabled' : '')
        });
        if (disabled) {
            addRow.setAttribute('disabled', true);
        }
        addRow.appendChild(TableTV.createElement('i', {class: 'icon icon-plus'}));
        addRow.addEventListener('click', e => {
            let row = e.currentTarget.parentNode;

            this.getRowRemoveButtons().forEach(el => {
                el.classList.remove('disabled');
                el.removeAttribute('disabled');
            });

            if (this.maxRows > 1) {
                if (this.rows < this.maxRows) {
                    this.addRow(this.columns, row);
                    this.change();
                }
                if (this.rows >= this.maxRows) {
                    this.getRowAddButtons().forEach(button => {
                        button.classList.add('disabled');
                        button.setAttribute('disabled', true);
                    });
                }
            } else {
                this.addRow(this.columns, row);
                this.change();
            }
        });

        return addRow;
    }

    createRemoveRow() {
        let removeRow = TableTV.createElement('button', {
            title: _('tvtable.del_row')
            ,class: 'remove-row x-btn x-btn-small tvt-button tvt-button-danger'
        });
        removeRow.appendChild(TableTV.createElement('i', {class: 'icon icon-minus'}));
        removeRow.addEventListener('click', e => {
            let row = e.currentTarget.parentNode;
            if (MODx.config.tvtable_remove_confirm == 1) {
                let isEmpty = true;
                this.getInputs(row).forEach(e => e.value != '' ? isEmpty = false : '');
                if (!isEmpty) {
                    Ext.Msg.confirm(_('confirm'), _('tvtable.remove_row_confirm'), btn => btn === 'yes' ? this.removeRow(row) : '');
                } else {
                    this.removeRow(row);
                }
            } else {
                this.removeRow(row);
            }
        });

        return removeRow;
    }

    removeRow(row) {
        row.remove();
        this.change();

        if (typeof this.maxRows != 'undefined' && this.maxRows > 0 && this.rows < this.maxRows) {
            this.getRowAddButtons().forEach(button => {
                button.classList.remove('disabled');
                button.removeAttribute('disabled');
            });
        }

        if (this.rows <= 1) {
            this.getRowRemoveButtons().forEach(button => {
                button.classList.add('disabled');
                button.setAttribute('disabled', true);
            });
        }

        if (typeof this.forceCountRows !== 'undefined' && this.rows <= this.forceCountRows) {
            this.getRowRemoveButtons().forEach(button => button.remove());
        }
    }

    addRow(values, row, disabled, withoutAddButton, withoutRemoveButton) {
        let rowDiv = TableTV.createElement('div', {class: 'tvt-row'});
        if (this.drag) {
            let handle = TableTV.createElement('span', {class: 'tvt-handle'});
            for (var i = 0; i < 3; i++) {
                let handleDot = TableTV.createElement('span', {class: 'tvt-handle-dot'});
                handleDot.innerText = '..';
                handle.appendChild(handleDot);
            }
            handle.setAttribute('draggable', true);
            rowDiv.appendChild(handle);
        }

        if (row) {
            TableTV.insertAfter(rowDiv, row);
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
    
    update() {
        let deleteColumns = this.elements.header.querySelectorAll('.tvt-tmp');
        if (deleteColumns.length > 0) {
            deleteColumns.forEach(el => el.remove());
        }
        
        let firstRow = this.getRow();
        let wrappers = firstRow.querySelectorAll('.tvt-input-wrapper');

        wrappers.forEach((wrapper, index) => {
            let deleteColumn = TableTV.createElement('span', {class: 'tvt-delete-column'});
            deleteColumn.dataset.columnIndex = index;
            if (typeof this.width === 'undefined' || this.width > 120) {
                deleteColumn.innerText = _('tvtable.del_column');
            } else {
                deleteColumn.classList.add('tvt-delete-column-sm');
                deleteColumn.innerText = '\u2716';
                deleteColumn.setAttribute('title', _('tvtable.del_column'));
            }
            deleteColumn.onclick = e => {
                let target = e.currentTarget;
                this.removeColumn(target.dataset.columnIndex);
                let buttons = this.getColumnDeleteButtons();

                buttons.forEach((button, index) => button.dataset.columnIndex = index);

                if (Ext.isArray(this.headers)) {
                    let headerElements = this.elements.header.querySelectorAll('.tvt-headers');
                    for (let i = 0; i < this.columns; i++) {
                        let header = this.headers[i] || this.headersDefault || '';
                        headerElements[i].innerText = header;
                        headerElements[i].setAttribute('title', header);
                    }
                }
            }

            let tmp = TableTV.createElement('div', {class: 'tvt-tmp'});
            if (this.width) tmp.style.width = (this.width + 16) + 'px';
            if (Ext.isArray(this.headers)) {
                let header = TableTV.createElement('span', {class: 'tvt-headers', title: this.headers[index] || ''});
                header.innerText = this.headers[index] || this.headersDefault || '';
                tmp.appendChild(header);
            }
            tmp.appendChild(deleteColumn);
            this.elements.header.appendChild(tmp);
        });
    }

    change() {
        this.update();

        let tvtArr = new Array();
        let rows = this.getRows();

        rows.forEach(row => {
            let itemsArr = new Array(),
                inputs = this.getInputs(row);

            inputs.forEach(item => {
                itemsArr.push(item.value);
            });
            
            tvtArr.push(itemsArr);
        });

        this.rows = tvtArr.length;
        this.columns = tvtArr[0].length;

        let value;
        if (TableTV.checkArray(tvtArr)) {
            this.field.value = value = JSON.stringify(tvtArr);
        } else {
            if (MODx.config.tvtable_clear_button == 1) {
                this.elements.clearTable.style.display = 'none';
            }
            this.field.value = value = '';
        }
        this.header = tvtArr[0];
        this.TVs[this.id].value = this.value = value;
        MODx.fireResourceFormChange();
    }

    getInputsWrappers(row) {
        return row.querySelectorAll('.tvt-input-wrapper');
    }

    getInputs(row) {
        return row.querySelectorAll('input.tvt-input');
    }

    getRow() {
        return this.elements.rows.querySelector('.tvt-row');
    }

    getRows() {
        return this.elements.rows.querySelectorAll('.tvt-row');
    }

    getColumnDeleteButtons() {
        return this.elements.header.querySelectorAll('.tvt-delete-column');
    }

    getRowAddButtons() {
        return this.elements.editor.querySelectorAll('.add-row');
    }

    getRowRemoveButtons() {
        return this.elements.editor.querySelectorAll('.remove-row');
    }

    get headers() {
        return this._headers ? this._headers.split('||') : [];
    }

    static createElement(type, attributes = {}, disabled) {
        let element = document.createElement(type);
        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        if (disabled) { element.setAttribute('disabled', true); }
        return element;
    }

    static checkArray(values) {
        let result = false;
        if (!Ext.isArray(values)) return result;
        values.forEach(row => {
            if (Ext.isArray(row)) {
                row.forEach(cell => cell ? result = true : '');
            } else if (row) {
                result = true;
            }
        });

        return result;
    }

    static insertAfter(elem, refElem) {
        return refElem.nextSibling ? refElem.parentNode.insertBefore(elem, refElem.nextSibling) : refElem.parentNode.appendChild(elem);
    }
}