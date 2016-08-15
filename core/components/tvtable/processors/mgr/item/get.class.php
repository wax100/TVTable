<?php

class TVTableItemGetProcessor extends modObjectGetProcessor
{
    public $objectType = 'TVTableItem';
    public $classKey = 'TVTableItem';
    public $languageTopics = array('tvtable:default');
    //public $permission = 'view';


    /**
     * We doing special check of permission
     * because of our objects is not an instances of modAccessibleObject
     *
     * @return mixed
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        return parent::process();
    }

}

return 'TVTableItemGetProcessor';