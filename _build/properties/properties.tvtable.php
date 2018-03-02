<?php

$properties = array();

$tmp = array(

    'classname' => array(
        'type' => 'textfield',
        'value' => 'tvtable',
    ),
    'tv' => array(
        'type' => 'numberfield',
        'value' => 0,
    ),
    'resource' => array(
        'type' => 'numberfield',
        'value' => 0,
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
        'value' => '@INLINE <table class="[[+classname]]"><tbody>[[+table]]</tbody></table>',
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