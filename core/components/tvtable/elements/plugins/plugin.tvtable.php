<?php
/** @var modX $modx */
$corePath = $modx->getOption('tvtable.core_path', null, $modx->getOption('core_path') . 'components/tvtable/');

switch ($modx->event->name) {
	case 'OnTVInputRenderList':
		$modx->event->output($corePath . 'elements/tv/input/');
		break;
	case 'OnTVInputPropertiesList':
		$modx->event->output($corePath . 'elements/tv/inputoptions/');
		break;
	case 'OnDocFormPrerender':
		$modx->regClientStartupScript('//code.jquery.com/jquery-1.11.2.min.js');
		break;
}