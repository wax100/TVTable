<div id="tv-input-properties-form{$tv}"></div>
{literal}

<script type="text/javascript">
// <![CDATA[
var params = {
{/literal}{foreach from=$params key=k item=v name='p'}
 '{$k}': '{$v|escape:"javascript"}'{if NOT $smarty.foreach.p.last},{/if}
{/foreach}{literal}
};
var oc = {'change':{fn:function(){Ext.getCmp('modx-panel-tv').markDirty();},scope:this}};
MODx.load({
    xtype: 'panel'
    ,layout: 'form'
    ,autoHeight: true
    ,cls: 'form-with-labels'
    ,border: false
    ,defaults: {
        msgTarget: 'under'
    }
    ,labelAlign: 'top'
    ,items: [{
        xtype: 'textfield'
        ,fieldLabel: '{/literal}{$tvt.headers}{literal}'
        ,description: MODx.expandHelp ? '' : '{/literal}{$tvt.headers_desc}{literal}'
        ,name: 'inopt_headers'
        ,hiddenName: 'inopt_headers'
        ,id: 'inopt_headers{/literal}{$tv}{literal}'
        ,value: params['headers']
        ,width: 200
        ,listeners: oc
    },{
        xtype: MODx.expandHelp ? 'label' : 'hidden'
        ,forId: 'inopt_headers{/literal}{$tv}{literal}'
        ,html: '{/literal}{$tvt.headers_desc}{literal}'
        ,cls: 'desc-under'
    },{
        xtype: 'numberfield'
        ,minValue: 1
        ,fieldLabel: '{/literal}{$tvt.columns}{literal}'
        ,description: MODx.expandHelp ? '' : '{/literal}{$tvt.columns_desc}{literal}'
        ,name: 'inopt_columns'
        ,hiddenName: 'inopt_columns'
        ,id: 'inopt_columns{/literal}{$tv}{literal}'
        ,value: params['columns']
        ,width: 200
        ,listeners: oc
    },{
        xtype: MODx.expandHelp ? 'label' : 'hidden'
        ,forId: 'inopt_columns{/literal}{$tv}{literal}'
        ,html: '{/literal}{$tvt.columns_desc}{literal}'
        ,cls: 'desc-under'
    },{
        xtype: 'numberfield'
        ,minValue: 1
        ,fieldLabel: '{/literal}{$tvt.max_columns}{literal}'
        ,description: MODx.expandHelp ? '' : '{/literal}{$tvt.max_columns_desc}{literal}'
        ,name: 'inopt_maxColumns'
        ,hiddenName: 'inopt_maxColumns'
        ,id: 'inopt_maxColumns{/literal}{$tv}{literal}'
        ,value: params['maxColumns']
        ,width: 200
        ,listeners: oc
    },{
        xtype: MODx.expandHelp ? 'label' : 'hidden'
        ,forId: 'inopt_maxColumns{/literal}{$tv}{literal}'
        ,html: '{/literal}{$tvt.max_columns_desc}{literal}'
        ,cls: 'desc-under'
    },{
        xtype: 'numberfield'
        ,minValue: 1
        ,fieldLabel: '{/literal}{$tvt.max_rows}{literal}'
        ,description: MODx.expandHelp ? '' : '{/literal}{$tvt.max_rows_desc}{literal}'
        ,name: 'inopt_maxRows'
        ,hiddenName: 'inopt_maxRows'
        ,id: 'inopt_maxRows{/literal}{$tv}{literal}'
        ,value: params['maxRows']
        ,width: 200
        ,listeners: oc
    },{
        xtype: MODx.expandHelp ? 'label' : 'hidden'
        ,forId: 'inopt_maxRows{/literal}{$tv}{literal}'
        ,html: '{/literal}{$tvt.max_rows_desc}{literal}'
        ,cls: 'desc-under'
    }]
    ,renderTo: 'tv-input-properties-form{/literal}{$tv}{literal}'
});
// ]]>
</script>
{/literal}