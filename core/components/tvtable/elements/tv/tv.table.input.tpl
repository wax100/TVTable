<input id="tv{$tv->id}" name="tv{$tv->id}" class="textfield" value="{$tv->get('value')|escape}" type="text"
{if $params.maxColumns!=''}data-max-columns="{$params.maxColumns}"{/if}
{if $params.maxRows!=''}data-max-rows="{$params.maxRows}"{/if}
{if $params.columns!=''}data-columns="{$params.columns}"{/if}
/> 
<script type="text/javascript">  
    window.ie9=window.XDomainRequest && window.performance; window.ie=window.ie && !window.ie9; /* IE9 patch */
    
    Ext.onReady(function() {
        var tvId = "tv" + "{$tv->id}";
        new TableTV(tvId);
    });
</script>
