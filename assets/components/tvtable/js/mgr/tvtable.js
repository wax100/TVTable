function TableTV (id) {
    this.id = id;
    this.field = document.getElementById(id);
    this.value = this.field.value;
    this.init = function (id) {
        var tvtArr = this.value ? Ext.util.JSON.decode(this.value) : [[""]];
        this.field.style.display = 'none';

        TVTable.addHeader(tvtArr[0], this.field);
        for (var row = 1; row < tvtArr.length; row++) {
            TVTable.addItem(tvtArr[row], null, this.field);
        }
    }

    this.init(id);
    TVTable.TVs[id] = this;
}

var TVTable = {
    addHeader: function(values, field) {
        var rowDiv = this.Util.createElement('div', {class: 'tvt-row tvt-header'});
        var box = this.Util.getNextSibling(field);
        box.appendChild(rowDiv);

        for (var i = 0; i < values.length; i++) {
            rowDiv.appendChild(this.build(values[i]));
        }

        rowDiv.appendChild(this.Util.createElement('input', {
            type: 'button'
            ,value: '\uf067'
            ,title: _('tvtable.add_row')
            ,class: 'add-row x-btn x-btn-small tvt-button primary-button'
        }));

        if (values.length > 1) {
            rowDiv.appendChild(this.Util.createElement('input', {
                type: 'button'
                ,value: '\uf053'
                ,title: _('tvtable.del_column')
                ,class: 'remove-column x-btn x-btn-small tvt-button tvt-button-danger'
            }));
        }

        rowDiv.appendChild(this.Util.createElement('input', {
            type: 'button'
            ,value: '\uF054'
            ,title: _('tvtable.add_column')
            ,class: 'add-column x-btn x-btn-small tvt-button primary-button'
        }));

        if (MODx.config.tvtable_clear_button == 1) {
            rowDiv.appendChild(this.Util.createElement('input', {
                type: 'button'
                ,value: '\uf021'
                ,title: _('tvtable.clear_table')
                ,class: 'clear-table x-btn x-btn-small tvt-button tvt-button-warning'
                ,style: (values.length > 1 || values.length === 1 && values[0] != '') ? 'display: inline-flex;' : 'display: none;'
            }));
        }
    }
    ,build: function(val) {
        return this.Util.createElement('input', {
            type: 'text'
            ,value: val
            ,class: 'x-form-text x-form-field'
        });
    }
    ,addItem: function(values, row, field) {        
        var rowDiv = this.Util.createElement('div', {
            type: 'text'
            ,class: 'tvt-row'
        });

        var editor = this.Util.getNextSibling(field);

        if (row) {
            this.Util.insertAfter(rowDiv, row);
        } else {
            editor.appendChild(rowDiv);
        }
        
        if (typeof values == 'number') {
            for (var i = 0; i < values; i++) {
                rowDiv.appendChild(this.build(''));
            }
        } else {
            for (var i = 0; i < values.length; i++) {
                rowDiv.appendChild(this.build((values) ? values[i] : ''));
            }
        }

        rowDiv.appendChild(this.Util.createElement('input', {
            type: 'button'
            ,value: '\uf067'
            ,title: _('tvtable.add_row')
            ,class: 'add-row x-btn x-btn-small tvt-button primary-button'
        }));
        
        rowDiv.appendChild(this.Util.createElement('input', {
            type: 'button'
            ,value: '\uf068'
            ,title: _('tvtable.del_row')
            ,class: 'remove-row x-btn x-btn-small tvt-button tvt-button-danger'
        }));
    }
    ,setEditor: function(field) {
        var tvtArr = new Array();

        var editor = this.Util.getNextSibling(field);
        var clearBtn = editor.querySelector('.clear-table');
        var rows = editor.querySelectorAll('.tvt-row');

        for (var x = 0; x < rows.length; x++) {
            var itemsArr = new Array();
            var inputs = rows[x].querySelectorAll('input[type="text"]');

            for (var y = 0; y < inputs.length; y++) {
                var item = inputs[y];
                itemsArr.push(item.value);
            }

            tvtArr.push(itemsArr);
        }

        if (this.Util.checkArray(tvtArr)) {
            var value = JSON.stringify(tvtArr);
            field.value = value;
        } else {
            clearBtn.style.display = 'none';
            field.value = '';
        }

        this.TVs[field.id].value = value;
        MODx.fireResourceFormChange();
    }
    ,TVs: {}
    ,Util: {
        createElement: function (type, attributes) {
            var element = document.createElement(type);
            for (key in attributes) {
                element.setAttribute(key, attributes[key]);
            }

            return element;
        }
        ,checkArray: function(array) {
            if (!Ext.isArray(array)) return false;

            for (var x = 0; x < array.length; x++) {
                var value = array[x];
                if (Ext.isArray(value)) {
                    for (var y = 0; y < value.length; y++) {
                        if (value[y] !== '') {
                            return true;
                        }
                    }
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
        ,getPrevSibling: function (elem, selector) {
            var sibling = elem.previousElementSibling;
            if (!selector) return sibling;
            while (sibling) {
                if (sibling.matches(selector)) return sibling;
                sibling = sibling.previousElementSibling;
            }
        }
        ,getNextSibling: function (elem, selector) {
            var sibling = elem.nextElementSibling;
            if (!selector) return sibling;
            while (sibling) {
                if (sibling.matches(selector)) return sibling;
                sibling = sibling.nextElementSibling
            }
        }
    }
}

document.onkeyup = function (e) {
    if (e.target.type == 'text') {
        var editor = e.target.closest('.tvtEditor');
        var field = TVTable.Util.getPrevSibling(editor);
        
        if (MODx.config.tvtable_clear_button == 1) {
            var clearBtn = editor.querySelector('.clear-table');
            clearBtn.style.display = 'inline-flex';
        }

        TVTable.setEditor(field);
    }
}

document.onclick = function (e) {
    // Add row
    if (e.target.classList.contains('add-row')) {
        var row = e.target.parentNode;
        var field = TVTable.Util.getPrevSibling(e.target.closest('.tvtEditor'));
        var length = row.querySelectorAll('input[type="text"]').length;
    
        TVTable.addItem(length, row, field);
        TVTable.setEditor(field);
    }
    // Remove row
    if (e.target.classList.contains('remove-row')) {
        var parent = e.target.parentNode;
        var field = TVTable.Util.getPrevSibling(e.target.closest('.tvtEditor'));

        parent.remove();
        TVTable.setEditor(field);
    }
    // Remove column
    if (e.target.classList.contains('remove-column')) {
        var editor = e.target.closest('.tvtEditor');
        var field = TVTable.Util.getPrevSibling(editor);
        var parent = e.target.parentNode;
        var length = parent.querySelectorAll('input[type="text"]').length;
        var rows = editor.querySelectorAll('.tvt-row');

        if (length > 1) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var inputs = row.querySelectorAll('input[type=text]');

                inputs[inputs.length - 1].remove();
            }
            TVTable.setEditor(field);
        }

        if (length === 2) {
            e.target.remove();
        }
    }
    // Add column
    if (e.target.classList.contains('add-column')) {
        var editor = e.target.closest('.tvtEditor');
        var field = TVTable.Util.getPrevSibling(editor);
        var parent = e.target.parentNode;
        var length = parent.querySelectorAll('input[type="text"]').length;
        var rows = editor.querySelectorAll('.tvt-row');
        
        if (length >= 1 && !parent.querySelectorAll('.remove-column').length) {
            TVTable.Util.insertAfter(TVTable.Util.createElement('input', {
                type: 'button'
                ,value: '\uf053'
                ,title: _('tvtable.del_column')
                ,class: 'remove-column x-btn x-btn-small tvt-button tvt-button-danger'
            }), parent.querySelector('.add-row'));
        }

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var inputs = row.querySelectorAll('input[type=text]');

            TVTable.Util.insertAfter(TVTable.build(''), inputs[inputs.length - 1])
        }
        TVTable.setEditor(field);
    }
    // Clear table
    if (e.target.classList.contains('clear-table')) {
        var editor = e.target.closest('.tvtEditor');
        var field = TVTable.Util.getPrevSibling(editor);
        var inputs = editor.querySelectorAll('input[type="text"]');

        inputs.forEach(function(e) {
            e.value = '';
        });

        if (MODx.config.tvtable_clear_button == 1) {
            e.target.style.display = 'none';
        }
        
        TVTable.setEditor(field);
    }
}