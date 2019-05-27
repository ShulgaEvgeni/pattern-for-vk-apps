<?php

/**
 * PHP Crossword Word
 *
 * @package		PHP_Crossword 
 * @copyright	Laurynas Butkus, 2004
 * @license		http://opensource.org/licenses/gpl-license.php GNU Public License
 * @version		0.2
 */
 
class PHP_Crossword_Word 
{
    var $word;
    var $axis;
    var $cells = array();
    var $fully_crossed = FALSE;
    var $inum = 0; # sandy addition

	/**
	 * Constructor
	 * @param string $word
	 * @param int $axis
	 */
    function PHP_Crossword_Word($word, $axis)

    {
        $this->word = $word;
        $this->axis = $axis;
    }

	/**
	 * Get word start X
	 * @return int
	 */
    function getStartX()
    {
        return $this->cells[0]->x;
    }

	/**
	 * Get word start Y
	 * @return int
	 */
    function getStartY()
    {
        return $this->cells[0]->y;
    }

	/**
	 * Get crossable cells in the word
	 * @return array
	 */
    function getCrossableCells()
    {
        $axis = $this->getCrossAxis();

        $cells = array();

        for ($i = 0; $i < strlen($this->word); $i++)
        	if ($this->cells[$i]->canCross($axis))
            	$cells[] =&  $this->cells[$i];

        if (!count($cells) )
            $this->fully_crossed = TRUE;

        return $cells;
    }

	/**
	 * Check if word is fully crossed
	 * @return boolean
	 */
    function isFullyCrossed()
    {
        if ($this->fully_crossed )
            return TRUE;

        $this->getCrossableCells();
		
        return $this->fully_crossed;
    }

	/**
	 * Get crossing axis
	 * @return int
	 */
    function getCrossAxis()
    {
        return $this->axis == PC_AXIS_H ? PC_AXIS_V : PC_AXIS_H;
    }

}
?>