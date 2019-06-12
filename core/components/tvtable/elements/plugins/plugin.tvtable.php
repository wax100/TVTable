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
        $modx->regClientCSS('/assets/components/tvtable/css/mgr/tvtable.css?ver=3.4.1');
        $modx->regClientStartupScript('/assets/components/tvtable/js/mgr/tvtable.js?ver=3.4.1');
        break;
    case 'OnManagerPageBeforeRender':
        $modx->controller->addLexiconTopic('tvtable:default');
        break;
}