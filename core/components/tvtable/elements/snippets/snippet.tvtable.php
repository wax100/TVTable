<?php
/** @var modX $modx */
/** @var array $scriptProperties */

$tv = $modx->getOption('tv', $scriptProperties, '');
$input = $modx->getOption('input', $scriptProperties, '');
$resource = (int) $modx->getOption('id', $scriptProperties, '');
$x = $modx->getOption('getX', $scriptProperties, '');
$y = $modx->getOption('getY', $scriptProperties, '');
$head = $modx->getOption('head', $scriptProperties, true, true);

$tdTpl = $modx->getOption('tdTpl', $scriptProperties, '@INLINE <td>[[+val]]</td>', true);
$thTpl = $modx->getOption('thTpl', $scriptProperties, '@INLINE <th>[[+val]]</th>', true);
$trTpl = $modx->getOption('trTpl', $scriptProperties, '@INLINE <tr>[[+cells]]</tr>', true);
$wrapperTpl = $modx->getOption('wrapperTpl', $scriptProperties, '@INLINE <table class="[[+classname]]">[[+table]]</table>', true);

$tableClass = $modx->getOption('tableClass', $scriptProperties, 'tvtable', true);
$headClass = $modx->getOption('headClass', $scriptProperties, '');
$bodyClass = $modx->getOption('bodyClass', $scriptProperties, '');

$classname = !empty($classname) ? $classname : $tableClass;
$headOpen = empty($headClass) ? '<thead>' : '<thead class="' . $headClass . '">';
$bodyOpen = empty($bodyClass) ? '<tbody>' : '<tbody class="' . $bodyClass . '">';

if (empty($tv) && empty($input)) return;

if (empty($input)) {
    if (!empty($resource)) {
        $resource = $modx->getObject('modResource', array('id' => $resource));
        if (!$resource instanceof modResource) return;
        $value = $resource->getTVValue($tv);
    } else {
        $value = $modx->resource->getTVValue($tv);
    }
} else {
    $value = $input;
}

$tvtArr = $modx->fromJSON($value);

if ($x == 'first') $x = 0;
if ($y == 'first') $y = 0;

if ($x !== '' && $y === '') {
    $directionX = true;
    if ($x === 'last') {
        $values = array_pop($tvtArr);
    } else {
        $values = $tvtArr[$x];
    }
} elseif ($x === '' && $y !== '') {
    foreach ($tvtArr as $key => $row) {
        if ($y === 'last') { $y = count($tvtArr[$key]) - 1; }
        $values[$key] = $tvtArr[$key][$y];
    }
} elseif ($x !== '' && $y !== '') {
    if ($x === 'last') { $x = count($tvtArr) - 1; }
    if ($y === 'last') { $y = count($tvtArr[$x]) - 1; }
    return $tvtArr[$x][$y];
} else {
    $values = $tvtArr;
}

/** @var pdoFetch $pdoFetch */
$fqn = $modx->getOption('pdoFetch.class', null, 'pdotools.pdofetch', true);
$path = $modx->getOption('pdofetch_class_path', null, MODX_CORE_PATH . 'components/pdotools/model/', true);
if ($pdoClass = $modx->loadClass($fqn, $path, false, true)) {
    $pdoFetch = new $pdoClass($modx, $scriptProperties);
} else {
    return false;
}
$pdoFetch->addTime('pdoTools loaded');
$output = $pdoFetch->run();
$fastMode = $pdoFetch->config['fastMode'];

if ($directionX) {
    foreach ($values as $value) {
        $cells .= $pdoFetch->getChunk($tdTpl, array('val' => $value), $fastMode);
    }
    $rows .= $bodyOpen . $pdoFetch->getChunk($trTpl, array('cells' => $cells), $fastMode) . '</tbody>';
} else {
    if ($head) {
        $rows .= $headOpen;
        $head = array_shift($values);
        if (is_array($head)) {
            foreach ($head as $row) {
                $rows .= $pdoFetch->getChunk($thTpl, array('val' => $row), $fastMode);
            }
        } else {
            $rows .= $pdoFetch->getChunk($thTpl, array('val' => $head), $fastMode);
        }
        $rows .= '</thead>';
    }
    if ($values) {
        $rows .= $bodyOpen;
        foreach ($values as $row) {
            $cells = '';
            if(is_array($row)) {
                foreach ($row as $cell) {
                    $cells .= $pdoFetch->getChunk($tdTpl, array('val' => $cell), $fastMode);
                }
            } else {
                $cells .= $pdoFetch->getChunk($tdTpl, array('val' => $row), $fastMode);
            }
            $rows .= $pdoFetch->getChunk($trTpl, array('cells' => $cells), $fastMode);
        }
        $rows .= '</tbody>';
    }
}

$output = $pdoFetch->getChunk($wrapperTpl, array('table' => $rows, 'classname' => $classname), $fastMode);

return $output;        