<?php

$properties = array();

$tmp = array(
    
    'tableClass' => array(
        'type' => 'textfield',
        'value' => '',
    ),
    'headClass' => array(
        'type' => 'textfield',
        'value' => '',
    ),
    'bodyClass' => array(
        'type' => 'textfield',
        'value' => '',
    ),
    'tv' => array(
        'type' => 'textfield',
        'value' => '',
    ),
    'id' => array(
        'type' => 'numberfield',
        'value' => '',
    ),
    'tdTpl' => array(
        'type' => 'textfield',
        'value' => '@INLINE <td>[[+val]]</td>',
    ),
     'thTpl' => array(
        'type' => 'textfield',
        'value' => '@INLINE <th>[[+val]]</th>',
    ),
    'trTpl' => array(
        'type' => 'textfield',
        'value' => '@INLINE <tr>[[+cells]]</tr>',
    ),
    'wrapperTpl' => array(
        'type' => 'textfield',
        'value' => '@INLINE <table class="[[+classname]]">[[+table]]</table>',
    ),

);

foreach ($tmp as $k => $v) {
    $properties[] = array_merge(
        array(
            'name' => $k,
            'desc' => PKG_NAME_LOWER . '_prop_' . $k,
            'lexicon' => PKG_NAME_LOWER . ':properties',
        ), $v
    );
}

return $properties;