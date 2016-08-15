<?php

/**
 * The home manager controller for TVTable.
 *
 */
class TVTableHomeManagerController extends modExtraManagerController
{
    /** @var TVTable $TVTable */
    public $TVTable;


    /**
     *
     */
    public function initialize()
    {
        $path = $this->modx->getOption('tvtable_core_path', null,
                $this->modx->getOption('core_path') . 'components/tvtable/') . 'model/tvtable/';
        $this->TVTable = $this->modx->getService('tvtable', 'TVTable', $path);
        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return array('tvtable:default');
    }


    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }


    /**
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('tvtable');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addCss($this->TVTable->config['cssUrl'] . 'mgr/main.css');
        $this->addCss($this->TVTable->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
        $this->addJavascript($this->TVTable->config['jsUrl'] . 'mgr/tvtable.js');
        $this->addJavascript($this->TVTable->config['jsUrl'] . 'mgr/misc/utils.js');
        $this->addJavascript($this->TVTable->config['jsUrl'] . 'mgr/misc/combo.js');
        $this->addJavascript($this->TVTable->config['jsUrl'] . 'mgr/widgets/items.grid.js');
        $this->addJavascript($this->TVTable->config['jsUrl'] . 'mgr/widgets/items.windows.js');
        $this->addJavascript($this->TVTable->config['jsUrl'] . 'mgr/widgets/home.panel.js');
        $this->addJavascript($this->TVTable->config['jsUrl'] . 'mgr/sections/home.js');

        $this->addHtml('<script type="text/javascript">
        TVTable.config = ' . json_encode($this->TVTable->config) . ';
        TVTable.config.connector_url = "' . $this->TVTable->config['connectorUrl'] . '";
        Ext.onReady(function() {
            MODx.load({ xtype: "tvtable-page-home"});
        });
        </script>
        ');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        return $this->TVTable->config['templatesPath'] . 'home.tpl';
    }
}