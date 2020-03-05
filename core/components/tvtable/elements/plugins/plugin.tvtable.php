<?php
/** @var modX $modx */
$corePath = $modx->getOption('tvtable.core_path', null, $modx->getOption('core_path') . 'components/tvtable/');
$assetsPath = $modx->getOption('assets_url', null, MODX_ASSETS_URL) . 'components/tvtable/';

switch ($modx->event->name) {
    case 'OnTVInputRenderList':
        $modx->event->output($corePath . 'elements/tv/input/');
        break;
    case 'OnTVInputPropertiesList':
        $modx->event->output($corePath . 'elements/tv/inputoptions/');
        break;
    case 'OnDocFormPrerender':
        $modx->regClientCSS($assetsPath . 'css/mgr/tvtable.css?ver=3.5.2');
        $modx->regClientStartupScript($assetsPath . 'js/mgr/tvtable.js?ver=3.5.2');
        break;
    case 'OnManagerPageBeforeRender':
        $modx->controller->addLexiconTopic('tvtable:default');
        break;
}
