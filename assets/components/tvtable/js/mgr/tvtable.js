var TVTable = {
    _createElement: function (type, attributes) {
        var element = document.createElement(type);
        for (key in attributes) {
            element.setAttribute(key, attributes[key]);
        }

        return element;
    }
    ,_checkArray: function(array) {
        if (!Ext.isArray(array)) return false;
        var values = 0;
        array.forEach(function(item, i, array) {
            if (Ext.isArray(array)) {
                item.forEach(function(item, i, array) {
                    if (item !== '') {
                        values++;
                    }
                });
            }
        });
        
        return values > 0 ? true : false;
    }
    ,_insertAfter: function (elem, refElem) {
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
    ,init: function(fid) {
        var field = document.getElementById(fid);
        var fldval = field.value;
        var tvtArr = fldval ? Ext.util.JSON.decode(fldval) : [["",""], ["",""]];
        field.style.display = 'none';

        TVTable.addHeader(tvtArr[0], field);
        for (var row = 1; row < tvtArr.length; row++) {
            TVTable.addItem(tvtArr[row], null, fid);
        }
    }
    ,addHeader: function(values, field){
        var rowDiv = TVTable._createElement('div', {class: 'tvtrow header'});

        var box = field.nextSibling;
        while(box && box.nodeType != 1) {
            box = box.nextSibling
        }
        box.appendChild(rowDiv);

        if (!values) values = ['',''];

        for (var i = 0; i < values.length; i++) {
            rowDiv.appendChild(TVTable.build(values[i]));
        }

        rowDiv.appendChild(TVTable._createElement('input', {
            type: 'button'
            ,value: '\uF054'
            ,title: _('tvtable.add_column')
            ,class: 'add x-btn x-btn-small'
        }));

        rowDiv.appendChild(TVTable._createElement('input', {
            type: 'button'
            ,value: '\uf053'
            ,title: _('tvtable.del_column')
            ,class: 'del x-btn x-btn-small'
        }));
    }
    ,build: function(val) {
        return TVTable._createElement('input', {
            type: 'text'
            ,value: val
            ,class: 'x-form-text x-form-field'
        });
    }
    ,addItem: function(values, elem, fidd) {        
        var rowDiv = TVTable._createElement('div', {
            type: 'text'
            ,class: 'tvtrow'
            ,style: 'white-space: nowrap; padding: 5px 0;'
        });

        var field = document.getElementById(fidd);
        var next = TVTable.getNextSibling(field);

        if (elem) {
            TVTable._insertAfter(rowDiv, elem);
        } else {
            next.appendChild(rowDiv);
        }
        
        if (typeof values == 'number') {
            for (var i = 0; i < values; i++) {
                rowDiv.appendChild(TVTable.build(''));
            }
        } else {
            for (var i = 0; i < values.length; i++) {
                rowDiv.appendChild(TVTable.build((values) ? values[i] : ''));
            }
        }

        rowDiv.appendChild(TVTable._createElement('input', {
            type: 'button'
            ,value: '\uf078'
            ,title: _('tvtable.add_row')
            ,class: 'add_item x-btn x-btn-small'
        }));
        
        if (next.querySelectorAll('.tvtrow').length > 2) {
            rowDiv.appendChild(TVTable._createElement('input', {
                type: 'button'
                ,value: '\uf077'
                ,title: _('tvtable.del_row')
                ,class: 'del_item x-btn x-btn-small'
            }));
        }
    }
    ,setEditor: function(fid){
        var tvtArr = new Array();

        var field = document.getElementById(fid);
        var next = TVTable.getNextSibling(field);
        var rows = next.querySelectorAll('.tvtrow');

        for (var x = 0; x < rows.length; x++) {
            var itemsArr = new Array();
            var inputs = rows[x].querySelectorAll('input[type="text"]');

            for (var y = 0; y < inputs.length; y++) {
                var item = inputs[y];
                itemsArr.push(item.value);
            }

            tvtArr.push(itemsArr);
        }

        if (TVTable._checkArray(tvtArr)) {
            var value = JSON.stringify(tvtArr);
            field.value = value;
        } else {
            field.value = '';
        }

        MODx.fireResourceFormChange();
    }
}

document.onkeyup = function (e) {
    if (e.target.type == 'text') {
        var prev = e.target.closest('.tvtEditor').previousSibling;
        while (prev && prev.nodeType != 1) {
            prev = prev.previousSibling;
        }
        TVTable.setEditor(prev.id);
    }
}

document.onclick = function (e) {
    // Add row
    if (e.target.classList.contains('add_item')) {
        var parent = e.target.parentNode;
        var length = parent.querySelectorAll('input[type="text"]').length;
        var input = e.target.closest('.tvtEditor').previousSibling;
    
        while (input && input.nodeType != 1) {
            input = input.previousSibling;
        }
    
        TVTable.addItem(length, parent, input.id);
        TVTable.setEditor(input.id);
    }
    // Remove row
    if (e.target.classList.contains('del_item')) {
        var prev = e.target.closest('.tvtEditor').previousSibling;
        var parent = e.target.parentNode;
        while (prev && prev.nodeType != 1) {
            prev = prev.previousSibling;
        }

        parent.remove();
        TVTable.setEditor(prev.id);
    }
    // delete column
    if (e.target.classList.contains('del')) {
        var prev = e.target.closest('.tvtEditor').previousSibling;
        while (prev && prev.nodeType != 1) {
            prev = prev.previousSibling;
        }

        var parent = e.target.parentNode;
        var length = parent.querySelectorAll('input[type="text"]').length;
        var next = TVTable.getNextSibling(prev);
        var rows = next.querySelectorAll('.tvtrow');

        if (length > 2) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var inputs = row.querySelectorAll('input[type=text]');

                inputs[inputs.length - 1].remove();
            }
            TVTable.setEditor(prev.id);
        }
    }
    // add column
    if (e.target.classList.contains('add')) {
        var prev = TVTable.getPrevSibling(e.target.closest('.tvtEditor'));

        var parent = e.target.parentNode;
        var length = parent.querySelectorAll('input[type="text"]').length;
        var next = TVTable.getNextSibling(prev);
        var rows = next.querySelectorAll('.tvtrow');

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var inputs = row.querySelectorAll('input[type=text]');

            TVTable._insertAfter(TVTable.build(''), inputs[inputs.length - 1])
        }
        TVTable.setEditor(prev.id);
    }
}