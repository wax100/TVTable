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
    
    if(typeof methods == 'undefined'){
        document.write('<script src="/assets/components/tvtable/js/mgr/tvtable.js"><\/script>');
    }
    
    window.ie9=window.XDomainRequest && window.performance; window.ie=window.ie && !window.ie9; /* IE9 patch */
   
    $(document).ready(function () {
        var tvIds = {$tv->id};
        $.myPlug('init', 'tv'+{$tv->id});
       
    });
  </script>
