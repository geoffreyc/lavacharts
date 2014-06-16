<?php namespace Khill\Lavacharts\Tests\Configs;

use Khill\Lavacharts\Tests\TestCase;
use Khill\Lavacharts\Configs\BoxStyle;
use Khill\Lavacharts\Configs\Gradient;

class BoxStyleTest extends TestCase {

    public function setUp()
    {
        parent::setUp();

        $this->bs = new BoxStyle();
    }

    public function testIfInstanceOfBoxStyle()
    {
        $this->assertInstanceOf('Khill\Lavacharts\Configs\BoxStyle', $this->bs);
    }

    public function testConstructorDefaults()
    {
        $this->assertRegExp('/#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?\b/', $this->bs->stroke);
        $this->assertEquals(null, $this->bs->strokeWidth);
        $this->assertEquals(null, $this->bs->rx);
        $this->assertEquals(null, $this->bs->ry);
        $this->assertEquals(null, $this->bs->gradient);
    }

    public function testConstructorValuesAssignment()
    {
        $boxStyle = new BoxStyle(array(
            'stroke'      => '#5B5B5B',
            'strokeWidth' => '5',
            'rx'          => '10',
            'ry'          => '10',
            'gradient'    => new gradient()
        ));

        $this->assertEquals('#5B5B5B', $boxStyle->stroke);
        $this->assertEquals('5',       $boxStyle->strokeWidth);
        $this->assertEquals('10',      $boxStyle->rx);
        $this->assertEquals('10',      $boxStyle->ry);
        $this->assertInstanceOf('Khill\Lavacharts\Configs\gradient', $boxStyle->gradient);
    }

    /**
     * @expectedException Khill\Lavacharts\Exceptions\InvalidConfigProperty
     */
    public function testConstructorWithInvalidPropertiesKey()
    {
        $boxStyle = new boxStyle(array('Lasagna' => '50%'));
    }

    public function testStokeWithNumericParams()
    {
        $this->bs->stroke('#DE02FB');

        $this->assertEquals('#DE02FB', $this->bs->stroke);
    }

    /**
     * @dataProvider numericParamsProvider
     */
    public function testStokeWidthWithNumericParams($testNum)
    {
        $this->bs->strokeWidth($testNum);

        $this->assertEquals($testNum, $this->bs->strokeWidth);
    }

    /**
     * @dataProvider numericParamsProvider
     */
    public function testRxWithNumericParams($testNum)
    {
        $this->bs->rx($testNum);

        $this->assertEquals($testNum, $this->bs->rx);
    }

    /**
     * @dataProvider numericParamsProvider
     */
    public function testRyWithNumericParams($testNum)
    {
        $this->bs->ry($testNum);

        $this->assertEquals($testNum, $this->bs->ry);
    }

    /**
     * @expectedException Khill\Lavacharts\Exceptions\InvalidConfigValue
     * @dataProvider badParamsProvider
     */
    public function testStrokeWithBadParams($badVals)
    {
        $this->bs->stroke($badVals);
    }

    /**
     * @expectedException Khill\Lavacharts\Exceptions\InvalidConfigValue
     * @dataProvider badParamsProvider
     */
    public function testStokeWidthWithBadParams($badVals)
    {
        $this->bs->strokeWidth($badVals);
    }

    /**
     * @expectedException Khill\Lavacharts\Exceptions\InvalidConfigValue
     * @dataProvider badParamsProvider
     */
    public function testRxWithBadParams($badVals)
    {
        $this->bs->rx($badVals);
    }

    /**
     * @expectedException Khill\Lavacharts\Exceptions\InvalidConfigValue
     * @dataProvider badParamsProvider
     */
    public function testRyWithBadParams($badVals)
    {
        $this->bs->ry($badVals);
    }


    public function badParamsProvider()
    {
        return array(
            array(array()),
            array(new \stdClass),
            array(true),
            array(null)
        );
    }

    public function numericParamsProvider()
    {
        return array(
            array(123),
            array('123')
        );
    }

}