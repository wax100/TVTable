function TableTV (id) {
    this.id = id;
    this.field = document.getElementById(id);
    this.value = this.field.value;
    this.init = function (id) {
        var tvtArr = this.value ? Ext.util.JSON.decode(this.value) : [["",""], ["",""]];
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

        if (!values) values = ['',''];

        for (var i = 0; i < values.length; i++) {
            rowDiv.appendChild(this.build(values[i]));
        }

        rowDiv.appendChild(this.Util.createElement('input', {
            type: 'button'
            ,value: '\uF054'
            ,title: _('tvtable.add_column')
            ,class: 'add-column x-btn x-btn-small tvt-button primary-button'
        }));

        if (values.length > 2) {
            rowDiv.appendChild(this.Util.createElement('input', {
                type: 'button'
                ,value: '\uf053'
                ,title: _('tvtable.del_column')
                ,class: 'remove-column x-btn x-btn-small tvt-button tvt-button-warning'
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
    ,addItem: function(values, elem, field) {        
        var rowDiv = this.Util.createElement('div', {
            type: 'text'
            ,class: 'tvt-row'
        });

        var next = this.Util.getNextSibling(field);

        if (elem) {
            this.Util.insertAfter(rowDiv, elem);
        } else {
            next.appendChild(rowDiv);
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
        
        if (next.querySelectorAll('.tvt-row').length > 2) {
            rowDiv.appendChild(this.Util.createElement('input', {
                type: 'button'
                ,value: '\uf068'
                ,title: _('tvtable.del_row')
                ,class: 'remove-row x-btn x-btn-small tvt-button tvt-button-warning'
            }));
        }
    }
    ,setEditor: function(field){
        var tvtArr = new Array();

        var next = this.Util.getNextSibling(field);
        var rows = next.querySelectorAll('.tvt-row');

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
        var prev = TVTable.Util.getPrevSibling(e.target.closest('.tvtEditor'));
        TVTable.setEditor(prev);
    }
}

document.onclick = function (e) {
    // Add row
    if (e.target.classList.contains('add-row')) {
        var parent = e.target.parentNode;
        var length = parent.querySelectorAll('input[type="text"]').length;
        var input = TVTable.Util.getPrevSibling(e.target.closest('.tvtEditor'));
    
        TVTable.addItem(length, parent, input);
        TVTable.setEditor(input);
    }
    // Remove row
    if (e.target.classList.contains('remove-row')) {
        var parent = e.target.parentNode;
        var prev = TVTable.Util.getPrevSibling(e.target.closest('.tvtEditor'));

        parent.remove();
        TVTable.setEditor(prev);
    }
    // delete column
    if (e.target.classList.contains('remove-column')) {
        var editor = TVTable.Util.getPrevSibling(e.target.closest('.tvtEditor'));
        var parent = e.target.parentNode;
        var length = parent.querySelectorAll('input[type="text"]').length;
        var field = TVTable.Util.getNextSibling(editor);
        var rows = field.querySelectorAll('.tvt-row');

        if (length > 2) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var inputs = row.querySelectorAll('input[type=text]');

                inputs[inputs.length - 1].remove();
            }
            TVTable.setEditor(editor);
        }

        if (length === 3) {
            e.target.remove();
        }
    }
    // add column
    if (e.target.classList.contains('add-column')) {
        var field = TVTable.Util.getPrevSibling(e.target.closest('.tvtEditor'));

        var parent = e.target.parentNode;
        var length = parent.querySelectorAll('input[type="text"]').length;
        var editor = TVTable.Util.getNextSibling(field);
        var rows = editor.querySelectorAll('.tvt-row');
        
        if (TVTable.Util.getNextSibling(e.target, '.remove-column') === undefined) {
            parent.appendChild(TVTable.Util.createElement('input', {
                type: 'button'
                ,value: '\uf053'
                ,title: _('tvtable.del_column')
                ,class: 'remove-column x-btn x-btn-small tvt-button tvt-button-warning'
            }));
        }

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var inputs = row.querySelectorAll('input[type=text]');

            TVTable.Util.insertAfter(TVTable.build(''), inputs[inputs.length - 1])
        }
        TVTable.setEditor(field);
    }
}