<input id="tv{$tv->id}" name="tv{$tv->id}" class="textfield" value="{$tv->get('value')|escape}" type = "text"/> 
<div class="tvtEditor"></div>
<style>
    .tvtEditor input[type="text"] { 
    width:200px; 
   max-width: 200px;
    height: 20px;
    margin-left: 5px;
    }
     .tvtEditor input[type="text"]:focus{
     box-shadow: 0 0 0 1px #556c88;
     }
    .tvtrow.header{
    background:#f0f0ee; 
    padding :5px 0; 
    white-space:nowrap;
    }
    .add, .del, .add_item, .del_item{
    width: 30px;
    height: 30px;
    margin-left: 5px;
    font-family: FontAwesome;
    background-color:#3697cd;
       color: #FFF;
    }
    .del, .del_item, .del:hover, .del_item:hover{
    background-color:#ec971f;
    }
    
    .del_item:hover, .del:hover{
    box-shadow: 0 0 0 1px #ec971f;
    }
    
    
    .tvtEditor .icon:before{
    position: relative;
    left: 25px;
    z-index: 999;
    }
    .tvtEditor .icon-minus:before{
    left: 29px;
    }
    
    
</style>


<script type="text/javascript">
    
    if(typeof methods == 'undefined'){
        document.write('<script src="/assets/components/tvtable/js/mgr/tvtable.js"><\/script>');
    }
    
    window.ie9=window.XDomainRequest && window.performance; window.ie=window.ie && !window.ie9; /* IE9 patch */
    
    $(document).ready(function () {
        var tvIds = "{$tv->id}";
        $.myPlug('init', "tv{$tv->id}");
        
    });
</script>
