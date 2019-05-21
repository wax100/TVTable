<?php

$modx->lexicon->load('tv_widget','tvtable:tv');
$modx->smarty->assign('base_url',$modx->getOption('base_url'));

$lang = $modx->lexicon->fetch('tvtable.', true);
$modx->smarty->assign('tvt', $lang);

$corePath = $modx->getOption('tvtable.core_path', null, $modx->getOption('core_path') . 'components/tvtable/');
return $modx->controller->fetchTemplate($corePath . 'elements/tv/tv.table.inputproperties.tpl');
