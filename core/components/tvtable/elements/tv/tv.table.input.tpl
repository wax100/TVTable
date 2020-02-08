<input id="tv{$tv->id}" name="tv{$tv->id}" class="textfield" value="{$tv->get('value')|escape}" type="text"/>
<script>
    if (typeof Sortable === 'undefined') {
        document.write('<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"><\/script>');
    }
</script>
<script type="text/javascript">  
    window.ie9=window.XDomainRequest && window.performance; window.ie=window.ie && !window.ie9; /* IE9 patch */
    
    Ext.onReady(function() {
        var tvId = 'tv' + '{$tv->id}';
        new TableTV(tvId, {
            {if $params.maxColumns!=''}maxColumns: {$params.maxColumns},{/if}
            {if $params.maxRows!=''}maxRows: {$params.maxRows},{/if}
            {if $params.columns!=''}forceCountColumns: {$params.columns},{/if}
            {if $params.rows!=''}forceCountRows: {$params.rows},{/if}
            {if $params.headers!=''}headers: '{$params.headers}',{/if}
            {if $params.headers_default!=''}headersDefault: '{$params.headers_default}',{/if}
            {if $params.width!=''}width: {$params.width},{/if}
            {if $params.drag!=''}drag: {$params.drag}{/if}
        });
    });
</script>
