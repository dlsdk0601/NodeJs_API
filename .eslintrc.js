module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "airbnb"
  ],
  "globals": {
    "Atomic": "readonly",
    "SharedArrayBuffer": "readonly",
    "JSX": true,
    "google": "readonly",
    "ReactNativeWebView": "readonly",
    "Razorpay": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "@typescript-eslint"
  ],
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "quotes": [
      "error",
      "double",
      {
        "avoidEscape": true
      }
    ],
    "@typescript-eslint/quotes": [
      "error",
      "double"
    ],
    // '' (x) -> "" (O)
    "linebreak-style": 0,
    // endOfLine \n (o) \r\n (x), 맥을 더 많이 쓰는 듯?
    "no-unused-vars": 0,
    // 사용안한 변수 경고 x
    "@typescript-eslint/no-unused-vars": "warn",
    // 사용안한 변수는 경고
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
          ".jsx",
          ".tsx"
        ]
      }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 2,
        "maxBOF": 1
      }
    ],
    "react/function-component-definition": 0,
    // 할까말까 고민했는데 const function 을 선호하는 사람도 있기 때문에 일단은 예외 해준다.
    "react/no-unescaped-entities": 0,
    // 기본 텍스트에까지 컨트롤하기에는 너무 빡시다.
    "react/jsx-props-no-spreading": 0,
    // props 스프레드 활성화
    "react/no-array-index-key": 0,
    // key 에 index 사용 가능하게 - 하지만 회사 컨벤션으로 바로 index 사용은 지양하자.
    "arrow-body-style": 0,
    // 화살표 함수 안에 return 사용 활성화
    "react/prop-types": 0,
    // proptypes 사용 x
    "jsx-a11y/anchor-is-valid": 0,
    // a tag 는 당연히 href 혹은 onClick 이 있어야 하는데 Link 로 감싸서 사용할 것이기 때문에 제외
    "jsx-a11y/label-has-associated-control": 0,
    // <label> <input> 에서 htmlFor 와 input id의 필수값을 제거 (id를 안 쓸 예정이기 때문에)
    "jsx-a11y/control-has-associated-label": 0,
    // 상호작용하는 엘리먼트에 label 안 써도 되게
    "comma-dangle": 1,
    // 마지막에 , 을 넣어준다.
    "no-trailing-spaces": 0,
    // 회사 자체 컨벤션 - 짧은 코드보다는 한 눈에 들어오는 코드 습관을 위해 사람에 직관성에 영향을 주는 의미 있는 줄바꿈은 권장한다.
    "object-curly-newline": 0,
    // 상황에 따라 한 줄, 여러 줄을 선택한다.
    "operator-linebreak": 0,
    // operator 가 포함 된 멀티 라인 대응
    "react/jsx-one-expression-per-line": 0,
    // jsx 한 줄에 여러번 쓸 수 있게
    "react/react-in-jsx-scope": 0,
    // import React from react 안 써도 되게
    "import/prefer-default-export": 0,
    // 개인 취향
    "implicit-arrow-linebreak": 0,
    // 상황에 따라 arrow function 은 줄을 바꿀 수 있게 한다.
    "no-use-before-define": 0,
    // styled-components 는 로직 최하단에 작성한다.
    "react/destructuring-assignment": 0,
    // props 에 관련해서는 구조분해를 사용하지 않고 사용할 예정
    "no-underscore-dangle": 0,
    // convention 상 첫 글자를 _로 시작할 수 있게 한다.
    "consistent-return": 0,
    // undefined 를 명시적으로 리턴해주기 위해서
    "no-shadow": 0,
    // 파일 내 중복 이름 가능
    "global-require": 0,
    // 지역적 require 활성화
    "react/require-default-props": 0,
    // default-props 필수 제거
    "no-alert": 0,
    // alert 허용
    "dot-notation": 0,
    // 객체 [" "] 접근 허용
    "max-classes-per-file": 0,
    // 파일 당 max classes 횟수 제한 x
    "class-methods-use-this": 0,
    // class methods에서 this 사용 강제 x
    "no-restricted-globals": 0,
    "function-paren-newline": 0,
    // static-element에 event 달 수 있게
    "jsx-a11y/no-static-element-interactions": 0,
    // no-noninteractive-element에 event 달 수 있게
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    // 클릭 이벤트에 대한 키보드 이벤트 필수 제거
    "jsx-a11y/click-events-have-key-events": 0,
    // class 에서 변수 줄바꿈 필수 예외
    "lines-between-class-members": 0,
    // req {} 사용을 위해
    "no-empty-pattern": 0,
    // arrow function에서 할당 반환 가능하게
    "no-return-assign": 0,
    // mobx model의 직접 할당을 위해
    "no-param-reassign": 0,
    // a++, a-- 가능하게 변경 (요청 사항)
    "no-plusplus": 0,
    // 19자 이후 >(closing-tag) 허용......
    "react/jsx-closing-bracket-location": 0,
    // <></> 사용 가능
    "react/jsx-no-useless-fragment": 0,
    // 배열 구조분해 할당 필수 제거
    "prefer-destructuring": 0,
    // if문에서 크기 비교는 항상 > 으로 하기로 한다.
    "yoda": 0,
    // function 앞에서 공간 넣기 O
    "space-before-function-paren": 0,
    "react/jsx-curly-newline": 0
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".d.ts"
        ]
      }
    },
    "eslint.workingDirectories": [
      {
        "mode": "auto"
      }
    ]
  }
}
