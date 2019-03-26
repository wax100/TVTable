<input id="tv{$tv->id}" name="tv{$tv->id}" class="textfield" value="{$tv->get('value')|escape}" type="text"/> 
<div class="tvtEditor"></div>
<script type="text/javascript">  
    window.ie9=window.XDomainRequest && window.performance; window.ie=window.ie && !window.ie9; /* IE9 patch */
    
    Ext.onReady(function() {
        var tvId = "{$tv->id}";
        TVTable.init('tv' + tvId);
    });
</script>
