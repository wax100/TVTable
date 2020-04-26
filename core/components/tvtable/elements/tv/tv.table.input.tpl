<input id="tv{$tv->id}" name="tv{$tv->id}" class="textfield" value="{$tv->get('value')|escape}" type="text"/>
<script>
    if (typeof Sortable === 'undefined') {
        let sortableTag = document.createElement('script');
        sortableTag.src = 'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js';
        document.head.appendChild(sortableTag);
    }
</script>
<script type="text/javascript">  
    window.ie9=window.XDomainRequest && window.performance; window.ie=window.ie && !window.ie9; /* IE9 patch */
    
    Ext.onReady(function() {
        var tvId = 'tv' + '{$tv->id}';
        new TableTV(tvId, {
            {if array_key_exists('maxColumns', $params) && $params.maxColumns!=''}maxColumns: {$params.maxColumns},{/if}
            {if array_key_exists('maxRows', $params) && $params.maxRows!=''}maxRows: {$params.maxRows},{/if}
            {if array_key_exists('columns', $params) && $params.columns!=''}forceCountColumns: {$params.columns},{/if}
            {if array_key_exists('rows', $params) && $params.rows!=''}forceCountRows: {$params.rows},{/if}
            {if array_key_exists('headers', $params) && $params.headers!=''}headers: '{$params.headers}',{/if}
            {if array_key_exists('headers_default', $params) && $params.headers_default!=''}headersDefault: '{$params.headers_default}',{/if}
            {if array_key_exists('width', $params) && $params.width!=''}width: {$params.width},{/if}
            {if array_key_exists('drag', $params) && $params.drag!=''}drag: {$params.drag}{/if}
        });
    });
</script>
