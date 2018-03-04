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
     * @return string
     */
    public function getTemplateFile()
    {
        return $this->TVTable->config['templatesPath'] . 'home.tpl';
    }
}