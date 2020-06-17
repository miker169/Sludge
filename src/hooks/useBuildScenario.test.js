import React from 'react';
import useBuildScenarios from "./useBuildScenarios";
import importOptionBuilder from "../lib/inputOptionBuilder";

describe('useBuildScenario', () => {
  let useStateSpy = jest.spyOn(React, 'useState');
  beforeEach(() => {
    useStateSpy.mockImplementation((initialState) => [
      [{testObj: 'test'}],
      jest.fn()
    ]);
  });
  test('returns an input Options list', () => {
    const [undefined, testInputOptions ] = useBuildScenarios();
    expect(testInputOptions[0].testObj).toBe('test');
  });

  describe('handleScenarioSelection', () => {
    test('calls buildInputOption', () => {
      let buildImportSpy = jest.spyOn(importOptionBuilder, 'buildInputOption');
      buildImportSpy.mockImplementation((jest.fn(), [])).mockReturnValue(() => {});
      const [testFn, testInputOptions ] = useBuildScenarios();
      testFn({});
      expect(buildImportSpy).toHaveBeenCalled();
    })
  });
});
