<?php
/** @var modX $modx */
/** @var array $scriptProperties */
$tv = (int)$tv ;
 
if ($tv == 0){
    return ;
}
$resource = isset($id) ? $id : $modx->resource->id;
$tvObject = $modx->getObject('modTemplateVarResource', array('tmplvarid' => $tv, 'contentid' => $resource ));
 if (!$tvObject){
    return ;
}
$tvv = $tvObject->get('value');
if (!$tvv || $tvv=='[["",""],["",""]]') return;

$tvtArr=json_decode($tvv);

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
 $is_header = 1;
for($row=0; $row<count($tvtArr); $row++) {
    $cells = '';
    for($i=0; $i<count($tvtArr[$row]); $i++){
        $tpl = $tdTpl;
        if($is_header){
            $tpl = $thTpl;
             $is_header=0;
        } 
        $cells.=$pdoFetch->getChunk($tpl,  array('val' => $tvtArr[$row][$i]), $fastMode);
       
    }
    $rows.=$pdoFetch->getChunk($trTpl,  array('cells' => $cells), $fastMode);
 }
$output = $pdoFetch->getChunk($wrapperTpl,  array('table' => $rows, 'classname'=>$classname), $fastMode);
return $output;