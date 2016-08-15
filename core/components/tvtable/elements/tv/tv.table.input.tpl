<input id="tv{$tv->id}" name="tv{$tv->id}" class="textfield" value="{$tv->get('value')|escape}" type = "text"/> 
<div class="tvtEditor"></div>
<style>
    input[type="text"] { 
    width:200px; 
    height: 20px;
    margin-left: 5px;
    }
    .tvtrow.header{
    background:#f0f0ee; 
    padding :5px 0; 
    white-space:nowrap;
    }
    .add, .del, .add_item, .del_item{
    width: 20px;
    height: 24px;
    margin-left: 5px;
    }
</style>


<script type="text/javascript">
    window.ie9=window.XDomainRequest && window.performance; window.ie=window.ie && !window.ie9; /* IE9 patch */
    var tvIds = [{$tv->id}];
    
    {literal}
    
    $(document).ready(function () {
        
        for (var i=0;i<tvIds.length;i++){
            var fid = 'tv'+ tvIds[i];
            if($(fid)!=null) {
                var modxTvTable=TvTable.initialize(fid);
            }
        }
        
        
         $('body').on('keyup', 'input[type="text"]', function(){

         TvTable.setEditor();
         //documentDirty=true;
             MODx.fireResourceFormChange();
         });
        
        // добавить удалить строку
        $('body').on('click', '.add_item', function(){
            TvTable.addItem(null,$(this).parent());
            TvTable.setEditor();
        });
        
        $('body').on('click', '.del_item', function(){
            $(this).parent().remove();
            TvTable.setEditor();
        });
        
        // добавить удалить столбик 
        
        $('body').on('click', '.del', function(){
            if ($(this).parent().find('input[type=text]').length>2){
                TvTable.cols--;
                $('.tvtEditor').find('div.tvtrow').each(function(item){
                    $(this).find('input[type=text]').last().remove();
                });
                TvTable.setEditor();
            }
        });
        
        $('body').on('click', '.add', function(){
        TvTable.cols++;
                $('.tvtEditor').find('div.tvtrow').each(function(item){
                    TvTable.build('').insertAfter($(this).find('input[type=text]').last());
                    });
                TvTable.setEditor();
        
        
        
           
        });
        
        
    });
    
    var TvTable = {
        initialize: function(fid){
            $fid = $('#'+fid);
            var tvtArr = ($fid.val()) ? $.parseJSON($fid.val()) : [null,null];
            $fid.hide();
            $box = $('.tvtEditor');
            this.addHeader(tvtArr[0]);
            for (var row=1;row < tvtArr.length;row++) this.addItem(tvtArr[row]);
            //this.box.adopt(new Element('input',{'type':'file','name':'file_'+fid,'styles':{'margin-top':'5px'}}));
        },
        build: function(val){
            return $('<input type="text" value="'+val+'" ></input> ');
        },
        addHeader: function(values,elem){
            $rowDiv = $('<div class="tvtrow header"></div>');
            //new Element('div',{'class':'tvtrow','styles':{'background':'#f0f0ee','padding':'5px 0','white-space':'nowrap'}});
            $box.append($rowDiv);
            if (!values) values=['',''];
            this.cols=values.length;
            for (var i=0;i<this.cols;i++) {
                $rowDiv.append(this.build(values[i]));
            }
            $add = $('<input type="button" value=">>" title="добавить столбик" class="add"></input> ');
            $rowDiv.append($add);
            $del = $('<input type="button" value="<<" title="удалить столбик"  class="del"></input> ');
            $rowDiv.append($del);
            /*$rowDiv.append(new Element('input',{'type':'button','value':'>>','events':{
                'click':function(){
                this.cols++;
                this.box.getElements('div.tvtrow').each(function(item){this.build('').injectAfter(item.getElements('input[type=text]').getLast());}.bind(this));
                this.setEditor();
                }.bind(this)
            }}));*/
            
            /*rowDiv.adopt(new Element('input',{'type':'button','value':'<<','events':{
                'click':function(){
                if (rowDiv.getElements('input[type=text]').length>2){
                this.cols--;
                this.box.getElements('div.tvtrow').each(function(item){item.getElements('input[type=text]').getLast().remove();});
                this.setEditor();
                }
                }.bind(this)
            }}));*/
        },
        addItem: function(values,elem){
            $rowDiv = $('<div class="tvtrow" style="white-space: nowrap; padding :5px 0; "></div>')
            if (elem){
                $rowDiv.insertAfter(elem);
                }else{
                $box.append($rowDiv);
            }
            
            console.log(this.cols);
            for (var i=0;i<this.cols;i++) {
                $rowDiv.append(this.build((values) ? values[i] : ''));
            }
            $rowDiv.append('<input type="button" value="+" title="добавить строку" class="add_item"></input>');
            if ($box.find('div.tvtrow').length > 2){
                $rowDiv.append('<input type="button" value="-" title="удалить строку" class="del_item"></input>');
            }
            
            /* var rowDiv = new Element('div',{'class':'tvtrow','styles':{'white-space':'nowrap'}});
                if (elem) {rowDiv.injectAfter(elem);} else {this.box.adopt(rowDiv);}
                for (var i=0;i<this.cols;i++) rowDiv.adopt(this.build((values) ? values[i] : ''));
                rowDiv.adopt(new Element('input',{'type':'button','value':'+','events': {
                'click':function(){this.addItem(null,rowDiv);}.bind(this)
                }}));
                if (this.box.getElements('div.tvtrow').length>2) rowDiv.adopt(new Element('input',{'type':'button','value':'-','events':{
                'click':function(){rowDiv.remove();this.setEditor();}.bind(this)
            }}));*/
        },
        setEditor: function(){
            var tvtArr=new Array();
            $box.find('div.tvtrow').each(function(item){
                var itemsArr=new Array();
                $inputs=$(this).find('input[type=text]');
                $inputs.each(function(item){
                itemsArr.push($(this).val());}
                );
                tvtArr.push(itemsArr);
            });
            var vl = JSON.stringify(tvtArr);
            // console.log(vl);
            $fid.val(vl);
           
            MODx.fireResourceFormChange();
            
        }
    };
    
    
    
    {/literal}
    
</script>