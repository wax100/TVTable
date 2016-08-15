<?php
class modTemplateVarInputRenderTableTV extends modTemplateVarInputRender
{
	public function getTemplate()
	{
		$corePath = $this->modx->getOption('table.core_path', null, $this->modx->getOption('core_path') . 'components/tvtable/');
		return $corePath . 'elements/tv/tv.table.input.tpl';
	}

}

return 'modTemplateVarInputRenderTableTV';