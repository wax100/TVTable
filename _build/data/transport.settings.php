<?php
/** @var modX $modx */
/** @var array $sources */

$settings = array();

$tmp = array(
    'clear_button' => array(
        'xtype' => 'combo-boolean',
        'value' => false,
        'area' => 'tvtable_main',
    ),
    'remove_confirm' => array(
        'xtype' => 'combo-boolean',
        'value' => true,
        'area' => 'tvtable_main',
    ),
);

foreach ($tmp as $k => $v) {
    /** @var modSystemSetting $setting */
    $setting = $modx->newObject('modSystemSetting');
    $setting->fromArray(array_merge(
        array(
            'key' => 'tvtable_' . $k,
            'namespace' => PKG_NAME_LOWER,
        ), $v
    ), '', true, true);

    $settings[] = $setting;
}
unset($tmp);

return $settings;
