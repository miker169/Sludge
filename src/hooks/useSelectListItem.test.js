import useSelectListItem from "./useSelectListItem";
import React from 'react';

describe('useSelectListItem', () => {
  const options = [
    {id:1, label: 'test1'}, {id:2, label: 'test2'}
  ];

  const useStateSpy = jest.spyOn(React, 'useState');
  const nextStateSpy = jest.spyOn(React, 'useState');
  const mockBuildScenario = jest.fn();

  test('returns a label text item', () => {
    useStateSpy.mockImplementationOnce((initialLabel) => [initialLabel, jest.fn()]);
    nextStateSpy.mockImplementationOnce((initialState) => [initialState, jest.fn()]);
    let [responseLabelText, listItemSelectHandler] = useSelectListItem(options, mockBuildScenario);
    expect(responseLabelText).toBe('Please Select...');
  });

  describe('listItemSelectHandler', () => {
    let setLabelTextMock =jest.fn();
    let setSelectedListOptionsMock = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      useStateSpy.mockImplementationOnce((initialLabel) => [initialLabel, setLabelTextMock]);
      nextStateSpy.mockImplementationOnce((initialState) => [initialState, setSelectedListOptionsMock]);
    })

    test('sets the new label text', () => {
      let selectedListItem = options[0];
      let [responseLabelText, listItemSelectHandler] = useSelectListItem(options, mockBuildScenario);
      listItemSelectHandler(selectedListItem);
      expect(setLabelTextMock).toHaveBeenCalledWith(selectedListItem.label);
    });

    test('calls build scenario on the new list item', () => {
      let selectedListItem = options[0];
      let [responseLabelText, listItemSelectHandler] = useSelectListItem(options, mockBuildScenario);
      listItemSelectHandler(selectedListItem);
      expect(mockBuildScenario).toHaveBeenCalledWith(selectedListItem);
    });

    test('calls set selected list item to set which item is selected in the options list', () => {
      let selectedListItem = options[0];
      let newSelectedList = [{...selectedListItem, selected: true}, {...options[1], selected: false}];
      let [responseLabelText, listItemSelectHandler] = useSelectListItem(options, mockBuildScenario);
      listItemSelectHandler(selectedListItem);
      expect(setSelectedListOptionsMock).toHaveBeenCalledWith(newSelectedList);
    });
  });
});
