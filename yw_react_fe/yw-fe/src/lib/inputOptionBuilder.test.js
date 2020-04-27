import {getColumn, buildInputOption} from "./inputOptionBuilder";


let initialInputOutputOptionsList = [
  {
    items: [
      { name: 'test1', id: 1},
      { name: 'test2', id: 2},
      { name: 'test3', id: 3},
      { name: 'test4', id: 4}
    ],
    idx: 1
  },
  {
    idx: 2,
    items: [
      {
        name: 'test5',
        id: 5,
      }
    ]
  },
  {
    items: [
      {
        name: 'test6',
        id: 6,
      }
    ],
    idx: 3
  },
  {
    idx: 4,
    items: [
      {
        name: 'test7',
        id: 7,
      }
    ]
  },
  {
    idx: 5,
    items: [
      {
        name: 'test8',
        id: 8,
      }
    ]
  }

]


describe('getColumnItem', () => {
  test('returns the correct columnItem for items on first tier', () => {
    let optionChosen = initialInputOutputOptionsList[0].items[3];
    let column = getColumn(initialInputOutputOptionsList, optionChosen);
    expect(column).toBe(1);
  });

  test('return the correct column item for items on the 5th tier', () => {
    let optionChosen = initialInputOutputOptionsList[4].items[0];
    let column = getColumn(initialInputOutputOptionsList, optionChosen);
    expect(column).toBe(5);
  })
});


describe('buildColumnItem',() => {
  let initialInputOutputOptionsList = [
    {
      items: [
        { name: 'test1', id: 1},
        { name: 'test2', id: 2},
        { name: 'test3', id: 3},
        { name: 'test4', id: 4}
      ],
      idx: 1
    }
    ];


  describe('When input options is the same length as the column number', () => {
    let setInputOptions;
    let optionSelected;
    let newItems = []
    beforeEach(() => {
      newItems =[];
      setInputOptions = jest.fn().mockImplementation((items) => {
        newItems = items;
      });
      optionSelected = initialInputOutputOptionsList[0].items[2];
      buildInputOption(setInputOptions, initialInputOutputOptionsList)(optionSelected);
    });
    test('it appends a new column item', () => {
      expect(newItems.length).toBe(2);
    });
    test('The new item has column index of 2', () => {
      expect(newItems[1].idx).toBe(2);
    })
  })


  describe('When input options length is greater than selected option', () => {
    let setInputOptions;
    let optionSelected;
    let inputs = [...initialInputOutputOptionsList,{
      items: [
        {
          name: 'test6',
          id: 6,
        }
      ],
      idx: 3
    }, {
      idx: 2,
      items: [
        {
          name: 'test5',
          id: 5,
        }
      ]
    }];


    describe('When an item is selected from the first column', () => {
      beforeEach(() => {
        setInputOptions = jest.fn().mockImplementation((items) => {
          inputs = items;
        });
        optionSelected = inputs[0].items[2];
        buildInputOption(setInputOptions, inputs)(optionSelected);

      });

      test('it returns a list with 2 elements', () => {
        expect(inputs.length).toBe(2);
      });
      test('The 2nd element has a idx of 2', () => {
        expect(inputs[1].idx).toBe(2);
      })
    });
  })
});
