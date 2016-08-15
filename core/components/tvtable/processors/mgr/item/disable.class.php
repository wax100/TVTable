<?php

class TVTableItemDisableProcessor extends modObjectProcessor
{
    public $objectType = 'TVTableItem';
    public $classKey = 'TVTableItem';
    public $languageTopics = array('tvtable');
    //public $permission = 'save';


    /**
     * @return array|string
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $ids = $this->modx->fromJSON($this->getProperty('ids'));
        if (empty($ids)) {
            return $this->failure($this->modx->lexicon('tvtable_item_err_ns'));
        }

        foreach ($ids as $id) {
            /** @var TVTableItem $object */
            if (!$object = $this->modx->getObject($this->classKey, $id)) {
                return $this->failure($this->modx->lexicon('tvtable_item_err_nf'));
            }

            $object->set('active', false);
            $object->save();
        }

        return $this->success();
    }

}

return 'TVTableItemDisableProcessor';
