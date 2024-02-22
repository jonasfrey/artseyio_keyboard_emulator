
import {
    f_o_js as f_o_js__tooltip
} from "https://deno.land/x/f_o_html_from_o_js@2.8/localhost/jsh_modules/tooltip/mod.js"



import {
    f_display_test_selection_or_run_selected_test_and_print_summary,
    f_o_test
} from "https://deno.land/x/deno_test_server_and_client_side@1.1/mod.js"

import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"


// o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
// o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    `
    .app{
        max-height: 100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        margin: 0 auto;
        flex-direction:column;
    }
    .a_o_key{
        width:100%;
        display:flex;
        flex-direction:row;
        flex-wrap:wrap;
    }
    textarea{
        flex: 1 1 auto;
        width:100%;
        box-sizing: border-box;
    }
    .o_key{
        aspect-ratio:1/1;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.3vw;   
    }
    .b_down{
        background:grey;
    }
    .o_key > div{
        position:relative;
        border-radius: 3px;
        border: 1px solid white;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `

);


import {
    f_o_html__and_make_renderable,
}
from 'https://deno.land/x/f_o_html_from_o_js@2.7/mod.js'

class O_event{
    constructor(
        s_char_key, 
        b_down, 
        n_ms_wpn
    ){
        this.s_char_key = s_char_key
        this.b_down = b_down
        this.n_ms_wpn = n_ms_wpn
    }
}
class O_key{
    constructor(
        s_text,
        b_down, 
        s_char_key
    ){
        this.s_text = s_text
        this.b_down = b_down 
        this.s_char_key = s_char_key
    }
}
class O_key_action{
    constructor(
        a_s_char_key,
        b_tap, 
        b_hold,
        n_ms_for_activation_hold,
        n_ms_delta_to_count_as_tap_combo,
        s_name_function_action, 
        a_v_arg_function_action
    ){
        this.a_s_char_key = a_s_char_key
        this.b_tap = b_tap 
        this.b_hold = b_hold
        this.n_ms_for_activation_hold = n_ms_for_activation_hold
        this.n_ms_delta_to_count_as_tap_combo = n_ms_delta_to_count_as_tap_combo
        this.s_name_function_action = s_name_function_action
        this.a_v_arg_function_action = a_v_arg_function_action
    }
}
let a_a_b_down__layout = [
    [
        1,0,0,0,
        0,0,0,0
    ]
]
let o_scl = new O_vec2(4,2)
let a_s_text = ['a','r','t','s','e','y','i','o']
let a_s_char_key = ['u', 'i', 'o', 'p', 'j', 'k', 'l', ';'];
let f_o_key_action_emit_from_params = function(a_n, s_char_key_to_emit){

    return new O_key_action(
        f_a_s_char_key__from_a_n(
            a_n
        ),
        true, 
        false,
        n_ms_for_activation_hold,
        n_ms_delta_to_count_as_tap_combo,
        'f_emit_keydown', 
        [s_char_key_to_emit]
    )
    f_a_s_char_key__from_a_n
}
let f_a_s_char_key__from_a_n = function(a_n){
    return a_n.map(
        (n, n_idx)=>{
            if(n == 0){
                return false
            }
            return a_s_char_key[n_idx]
        }
    ).filter(v=>v)
}
let o_s_name_function_f_function = {
    f_emit_keydown : function(s_char_key){
        console.log(s_char_key)

        // var event = new KeyboardEvent('keydown', {
        //     key: s_char_key,
        //     // keyCode: keyCode,
        //     bubbles: true,
        //     cancelable: true
        // });
        // document.dispatchEvent(event);
        // custom events will have o.isTrusted == false, and will not reflect in inputs such as textareas and inputs...
        // therefore we have to render by our own
        
        console.log(s_char_key)
        let n_length_max = 100;

        if(s_char_key == '<backSpace>'){
            o_state.s_text_input = o_state.s_text_input.slice(0,-1)
            o_state?.o_js__text._f_update()
            return
        }
        o_state.s_text_input = [
            ...Array.from(
                o_state.s_text_input
            ),
            s_char_key
        ].slice(-n_length_max).join('')
        o_state?.o_js__text._f_update()
    }
}
let n_ms_for_activation_hold = 300;
let n_ms_delta_to_count_as_tap_combo = 60;
let o_state = {
    s_text_input: '',
    n_ms_timeout_for_check_actions: 50, 
    n_id_timeout: 0,
    a_o_key_action: [
        ...a_s_text.map((s,n_idx)=>{
            return new O_key_action(
                a_s_char_key[n_idx],
                true,
                false,
                n_ms_for_activation_hold,
                n_ms_delta_to_count_as_tap_combo,
                'f_emit_keydown', 
                [a_s_text[n_idx]]
            )
        }),
        ...[
            [
                [
                    0,0,0,0,
                    1,0,0,1
                ],
                'b'
            ],
            [
                [
                    0,0,0,0,
                    1,1,0,0
                ],
                'c'
            ],
            [
                [
                    1,1,1,0,
                    0,0,0,0
                ],
                'd'
            ],
            [
                [
                    1,1,0,0,
                    0,0,0,0
                ],
                'f'
            ],
            [
                [
                    0,1,1,0,
                    0,0,0,0
                ],
                'g'
            ],
            [
                [
                    0,0,0,0,
                    1,0,1,0
                ],
                'h'
            ],
            [
                [
                    0,0,1,1,
                    0,0,0,0
                ],
                'j'
            ],
            [
                [
                    0,0,0,0,
                    0,1,0,1
                ],
                'k'
            ],
            [
                [
                    0,0,0,0,
                    1,1,1,0
                ],
                'l'
            ],
            [
                [
                    1,0,0,0,
                    1,0,0,0
                ],
                '\r\n'
            ],
            [
                [
                    1,0,0,0,
                    0,1,1,0
                ],
                "'"
            ],
            [
                [
                    1,0,0,0,
                    0,1,0,0
                ],
                '.'
            ],
            [
                [
                    1,0,0,0,
                    0,0,1,0
                ],
                ','
            ],
            [
                [
                    1,0,0,0,
                    0,0,0,1
                ],
                '/'
            ],
            [
                [
                    0,0,1,0,
                    0,0,1,0
                ],
                '!'
            ],
            [
                [
                    0,0,0,0,
                    1,1,1,1
                ],
                ' '
            ],
            [
                [
                    0,1,0,0,
                    1,0,0,0
                ],
                '<backSpace>'
            ],
            [
                [
                    0,1,0,0,
                    0,0,1,0
                ],
                '<delete>'
            ],
            [
                [
                    0,0,0,0,
                    0,1,1,1
                ],
                'm'
            ],
            [
                [
                    0,0,0,0,
                    0,0,1,1
                ],
                'n'
            ],
            [
                [
                    0,0,0,0,
                    1,0,1,1
                ],
                'p'
            ],
            [
                [
                    1,0,1,1,
                    0,0,0,0
                ],
                'q'
            ],
            [
                [
                    0,0,0,0,
                    0,1,1,0
                ],
                'u'
            ],
            [
                [
                    0,1,0,1,
                    0,0,0,0
                ],
                'v'
            ],
            [
                [
                    1,0,0,1,
                    0,0,0,0
                ],
                'w'
            ],
            [
                [
                    0,1,1,1,
                    0,0,0,0
                ],
                'x'
            ],
            [
                [
                    1,1,1,1,
                    0,0,0,0
                ],
                'z'
            ],
            [
                [
                    1,1,0,0,
                    0,0,0,1
                ],
                '<esc>'
            ],
            [
                [
                    1,1,1,0,
                    0,0,0,1
                ],
                '\t'
            ],
            [
                [
                    0,0,0,1,
                    1,0,0,0
                ],
                '<ctrl>'
            ],
            [
                [
                    0,0,0,1,
                    0,1,0,0
                ],
                '<gui>'
            ],
            [
                [
                    0,0,0,1,
                    0,0,1,0
                ],
                '<alt>'
            ],
            [
                [
                    0,1,1,1,
                    1,0,0,0
                ],
                '<shift>'
            ],
            [
                [
                    0,1,0,0,
                    0,1,0,0
                ],
                '<shift_lock>'
            ],
            [
                [
                    1,0,0,0,
                    0,1,1,1
                ],
                '<caps_lock>'
            ],
            [
                [
                    0,1,1,0,
                    0,1,1,0
                ],
                '<clear_bluetooth>'
            ],
        ].map(a_v=>{return f_o_key_action_emit_from_params(...a_v)})
    ],
    o_scl: o_scl,
    a_s_text: a_s_text,
    n_ms_delta_to_count_as_single_key: 60,
    a_o_event: [], 
    a_o_event__per_key: [],
    a_o_key: new Array(o_scl.compsmul()).fill(0).map(
        (n, n_idx)=>{
            return new O_key(
                a_s_text[n_idx],
                false,
                a_s_char_key[n_idx]
            )
        }
    )
}
window.o_state = o_state
document.body.appendChild(
    await f_o_html__and_make_renderable(
        {
            s_tag: 'div', 
            class: "app",
            a_o: [
                {
                    style: [
                        'display:flex',
                        'flex-direction:row',
                        'max-height: 100vh'
                    ].join(';'),
                    a_o: [
                        {
                            style: 'padding: 1rem',
                            a_o: [
                                {
                                    innerText: 'ARTSEYIO - Keyboard Emulator'
                                }, 
                                {
                                    s_tag: "p",
                                    innerHTML: "credits for the layout idea go to <a href='https://artsey.io/'>artsey.io</a>"
                                },
                                Object.assign(
                                    o_state, 
                                    {
                                        o_js__a_o_key: {
                                            f_o_jsh:()=>{
                                                return {
                                                    class: "a_o_key",
                                                    a_o: [
                                                        ...o_state.a_o_key.map(
                                                            (o_key,n_idx) =>{
                                                                return {
                                                                    a_o:[
                                                                        {
                                                                            a_o: [
                                                                                {
                                                                                    innerText: o_state.a_s_text[n_idx].toUpperCase(), 
                                                                                },
                                                                                {
                                                                                    style: [
                                                                                        `position:absolute`, 
                                                                                        `left: 9px`,
                                                                                        `top: 9px`,
                                                                                        `font-size: 12px`

                                                                                    ].join(';'),
                                                                                    innerText: `(${o_key.s_char_key})`, 
                                                                                },
                                                                            ]
                                                                        }, 
                                                                    ],
                                                                    class: [
                                                                        'o_key', 
                                                                        (o_state.a_o_event__per_key.find(o=>{
                                                                            return o.s_char_key == o_key.s_char_key
                                                                        })?.b_down) ? 'b_down' : false
                                                                    ].filter(v=>v).join(' '),
                                                                    style: `flex: 0 0 ${100/o_state.o_scl.n_x}%`
                                                                }
                                                            }
                                                        )
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ).o_js__a_o_key,
                                {
                                    innerText: "Try out the ARTSEYIO layout in the textarea below!"
                                },
                                Object.assign(
                                    o_state,
                                    {
                                        o_js__text: {
                                            f_o_jsh:()=>{
                                                return {
                                                    s_tag: 'textarea',
                                                    innerHTML: o_state.s_text_input,
                                                    value: o_state.s_text_input, 
                                                    onkeydown: (o_e)=>{
                                                        f_custom_key_press_event(o_e)
                                                    },
                                                    onkeyup: (o_e)=>{
                                                        f_custom_key_press_event(o_e)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ).o_js__text, 

                            ]
                        },  
                        {
                            s_tag:'img',
                            src: './layout_diagram_combos_right_only.jpg',
                            style: [
                                'max-height: 100vh',
                                'width: auto ',
                                'height: auto ',
                            ].join(';')
                        }
                        // {
                        //     style: [
                        //         'aspect-ratio: 1/1'
                        //     ].join(';'),
                        //     a_o: [
                        //         {
        
                        //             // s_tag:'img',
                        //             style: [
                        //                 `background-image: url(./layout_diagram_combos_right_only.jpg)`,
                        //                 // 'max-width: 100%', 
                        //                 // 'max-height: 100%',
                        //                 // 'object-fit: contain'
                        //             ].join(';'),
                        //             // src: './layout_diagram_combos_right_only.jpg'
                        //         }
                        //     ]
                        // }
                        
                    ]
                }
            ]
        }
    )
);
let f_check_and_potentially_execute_actions = function(){
    let a_o_event_down = o_state.a_o_event__per_key.filter(
        o=>{
            return o.b_down
        }
    ).sort(
        (o1, o2)=>{
            return o1.n_ms_wpn - o2.n_ms_wpn
        }
    );
    // console.log(
    //     a_o_event_down.map(o=>o.s_char_key)
    // );
    let n_ms_delta = 0;
    let a_o_event_down__combined = a_o_event_down.filter(
        o=>{
            return Math.abs(a_o_event_down[0].n_ms_wpn - o.n_ms_wpn) < o_state.n_ms_delta_to_count_as_single_key
        }
    );
    console.log(a_o_event_down__combined);
    let a_o_key_action = o_state.a_o_key_action.filter(o=>{
        return o.a_s_char_key.length == a_o_event_down__combined.length
            && ! a_o_event_down__combined.find(o2=>{
                return !o.a_s_char_key.includes(o2.s_char_key)
            })
    })
    console.log(a_o_key_action)
    for(let o_key_action of a_o_key_action){
        let f = o_s_name_function_f_function[o_key_action.s_name_function_action];
        f(o_key_action.a_v_arg_function_action)
    }
}
let f_update_a_o_event__per_key = function(o_event){
    let o_event_existing = o_state.a_o_event__per_key.find(o=>{
        return o.s_char_key == o_event.s_char_key
    });
    if(!o_event_existing){
        o_event_existing = o_event;
        o_state.a_o_event__per_key.push(o_event);
    }
    o_state.a_o_event__per_key[o_state.a_o_event__per_key.indexOf(o_event_existing)] = o_event;
}
let f_fix_alt_tab_bug = function(
    b_alt_pressed
){
    // on linux there is a bug 
    // Problem: keyup event for 'alt left' is not triggered when swiching
    // from a other application for example vscode to the chrome browser
    

    // therefore we have to double check if the alt key is pressed and update the event accordingly
    let o_event__alt = o_state.a_o_event__per_key.find(o=>o.s_char_key.toLowerCase() == 'alt')
    if(o_event__alt){
        o_event__alt.b_down = b_alt_pressed;
    }
}
let f_custom_key_press_event = async function(o_e){
    if(o_e.isTrusted ){ //dont catch emulated events
        let o_event = new O_event(
            o_e.key,
            o_e.type == 'keydown', 
            window.performance.now()
        )
        f_fix_alt_tab_bug(o_e.altKey)
        // could be used for history, but would spam the memory 
        // o_state.a_o_event.push(
        //     o_event
        // )
        f_update_a_o_event__per_key(o_event);
        clearTimeout(o_state.n_id_timeout);
        o_state.n_id_timeout = window.setTimeout(
            ()=>{
                f_check_and_potentially_execute_actions();
            }, 
            o_state.n_ms_timeout_for_check_actions
        )
        await o_state?.o_js__a_o_key._f_render();
        o_e.stopPropagation();
        o_e.preventDefault();
    }
}
console.log(document.querySelector('textarea'))
document.querySelector('textarea').focus()
document.querySelector('textarea').click()

document.addEventListener('DOMContentLoaded', function() {
    var textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  });
  