var methods = {
    fidd: null, 
    init : function(fid) { 
        fidd = $('#'+fid);
        $fid = $('#'+fid);
        var tvtArr = ($fid.val()) ? $.parseJSON($fid.val()) : [["",""], ["",""]];
        
        $fid.hide();
        $box = $fid.next();
        methods.addHeader(tvtArr[0]);
        for (var row=1;row < tvtArr.length;row++) {
            methods.addItem(tvtArr[row], null, fid);
        }
        
    },
    addHeader: function(values,elem){
        $rowDiv = $('<div class="tvtrow header"></div>');
        $box.append($rowDiv);
        if (!values) values=['',''];
        for (var i=0;i<values.length;i++) {
            $rowDiv.append(methods.build(values[i]));
        }
        $add = $(' <input type="button" value="&#xf054;" title="'+_('tvtable.add_column')+'" class="add x-btn x-btn-small">  ');
        $rowDiv.append($add);
        $del = $('<input type="button" value="&#xf053;" title="'+_('tvtable.del_column')+'"  class="del x-btn x-btn-small"> ');
        $rowDiv.append($del);
    },
    build: function(val){
        return $('<input type="text" class="x-form-text x-form-field" value="'+val+'" ></input> ');
    },
    addItem: function(values,elem, fidd){
        
        fidd = '#'+fidd;
        $rowDiv = $('<div class="tvtrow" style="white-space: nowrap; padding :5px 0; "></div>')
        
        if (elem){
            
            $rowDiv.insertAfter(elem);
            }else{
            $(fidd).next().append($rowDiv);
        }
        
        if(typeof values == 'number'){
            for (var i=0;i<values;i++) {
                $rowDiv.append(methods.build(''));
            }
            }else{
            for (var i=0;i<values.length;i++) {
                $rowDiv.append(methods.build((values) ? values[i] : ''));
            }
        }
        
        $rowDiv.append('<input type="button" value="&#xf078;"   title="'+_('tvtable.add_row')+'" class="add_item x-btn x-btn-small">');
        
        if ($(fidd).next().find('div.tvtrow').length > 2){
            $rowDiv.append('<input type="button" value="&#xf077;" title="'+_('tvtable.del_row')+'" class="del_item x-btn x-btn-small">');
        }
    },
    setEditor: function(fid){
        var tvtArr=new Array();
        $('#'+fid).next().find('div.tvtrow').each(function(item){
            var itemsArr=new Array();
            $inputs=$(this).find('input[type=text]');
            $inputs.each(function(item){
            itemsArr.push($(this).val());}
            );
            tvtArr.push(itemsArr);
        });
        var vl = JSON.stringify(tvtArr);
        $('#'+fid).val(vl);
        MODx.fireResourceFormChange();
    }
};
$.myPlug = function(method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
        return methods.init.apply(this, arguments);
        } else {
        $.error( 'No method ' +  method + ' exists for $.chats' );
    } 
};

$('body').on('keyup', 'input[type="text"]', function(){
    $.myPlug('setEditor', $(this).closest('.tvtEditor').prev().attr('id'));
    MODx.fireResourceFormChange();
});

// добавить удалить строку
$('body').on('click', '.add_item', function(){
    $.myPlug('addItem', $(this).parent().find('input[type="text"]').length,$(this).parent(), $(this).closest('.tvtEditor').prev().attr('id'));
    $.myPlug('setEditor', $(this).closest('.tvtEditor').prev().attr('id'));
});

$('body').on('click', '.del_item', function(){
    var iff = $(this).closest('.tvtEditor').prev().attr('id')
    $(this).parent().remove();
    $.myPlug('setEditor', iff);
});

// добавить удалить столбик 

$('body').on('click', '.del', function(){
    var iff = $(this).closest('.tvtEditor').prev().attr('id')
    if ($(this).parent().find('input[type=text]').length>2){
        $('#' + iff).next().find('div.tvtrow').each(function(item){
            $(this).find('input[type=text]').last().remove();
        });
        $.myPlug('setEditor', iff);
    }
});

$('body').on('click', '.add', function(){
    var iff = $(this).closest('.tvtEditor').prev().attr('id');
    console.log('#' + iff +' .tvtEditor')
    $('#' + iff).next().find('div.tvtrow').each(function(item){
        methods.build('').insertAfter($(this).find('input[type=text]').last());
    });
    $.myPlug('setEditor', iff);
});


