/* eslint-disable import/no-extraneous-dependencies */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 UFORM rules
|
*/

import { registerValidationRules } from '@formily/antd';

import rules from './Rules';

registerValidationRules(rules);
