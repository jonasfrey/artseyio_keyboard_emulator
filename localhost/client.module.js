
import {
    f_o_js as f_o_js__tooltip
} from "https://deno.land/x/f_o_html_from_o_js@2.8/localhost/jsh_modules/tooltip/mod.js"

import {
    f_a_v_add_v_circular_to_array
}from "https://deno.land/x/handyhelpers@3.5/mod.js"

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

import {
    f_n_idx_binding_from_params,
    f_o_gpu_gateway, 
    f_o_gpu_gateway__from_simple_fragment_shader,
    f_o_gpu_gateway_webgpu,
    f_o_gpu_gateway_webgpu_dataitem__buffer_from_v_as_type,
    f_o_gpu_texture__from_o_web_api_object,
    f_render_o_gpu_gateway,
    f_render_o_gpu_gateway_webgpu,
    f_s_autogenerated_accessor_functions,
    f_s_binding_declaration__from_o_gpu_gateway_webgpu,
    f_update_data_in_o_gpu_gateway,
    f_update_data_in_o_gpu_gateway_webgpu,

}
from 'https://deno.land/x/gpugateway@0.4/mod.js'
let o_gpu_gateway = null;
let n_len_a_o_key = null;
let o_location__a_o_trn = null;
let a_o_key = null;

let o_scl = new O_vec2(4,2)

// events
// - the 'tap' event
//      a key is pressed , will be down for a short time, and will be released, 
//      this is the classical
// - the 'hold' event 
//      if a key is pressed and held down a different event will be triggered
//      if there is no hold event defined, the 'tap' event will be repeated every n_milliseconds
//      which allows the user to for example delete multiple keys quickly by holding backSpace
// - the 'double/triple/quadruple etc.' event
//      if a tap event occurs quickly n-times in a row 
// - the 'secret code' event 
//      a specific order of tap events with different distances to each other, 
//      a classical example for this is the 'secret know' , 'ta   tata   ta  ta , ta  ta'
// - 'groups'
//      all of the events above can be triggered only if a group of keys is simultaniously clicked
//      a group is considered a group if the delay between keys is in a certain limit
//        - if the delay from last key to each previous key is smaller than the limit
//       - if the delay of each following key to the key before is within a certain limit
//          
//      this introduces a exponential complexity since there are so many possible combination of all of the aboce
// possible problems/questions, 
// if for example a group would be hitting 'jkl;' toghether, and the tap event would be emmiting a '\r\n'(enter) key. 
// would the event get executed if the 'jkl;' keydown's are close enough for all keys to be considered a group
// but the in keyup event the keys get liftet with a bigger delay (example below) 
//               0ms                                             500ms
// keydown timeline:     jl k ;     
// key  up timeline:               j k    l        ;
// group limit(50ms)           
//                       ^-30ms-^  inside a timespan of 30ms all keys were pressed, keydown occurs close enought for all keys, 
//                                  keydowns count as a group 
//
//                                 ^---------^-----^ 80ms, keyups do not occur close enought to be counted as a group

// for easiness, as soon as a keydown group is identified, it will be counted as a group
// if 
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
        a_n_ms_wpn_down, 
        a_n_ms_wpn_up, 
        b_key_action_fired, 
        b_grouped,
        n_len_max_a_n_ms = n_len_max_a_n_ms
    ){
        this.s_char_key = s_char_key
        this.b_down = b_down
        this.a_n_ms_wpn_down = a_n_ms_wpn_down; 
        this.a_n_ms_wpn_up = a_n_ms_wpn_up
        this.b_key_action_fired = b_key_action_fired, 
        this.b_grouped = b_grouped
        this.n_len_max_a_n_ms = n_len_max_a_n_ms
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
        f_action,
        n_ms_last_action_call
    ){
        this.a_s_char_key = a_s_char_key
        this.b_tap = b_tap 
        this.b_hold = b_hold
        this.n_ms_for_activation_hold = n_ms_for_activation_hold
        this.n_ms_delta_to_count_as_tap_combo = n_ms_delta_to_count_as_tap_combo
        this.f_action = f_action
        this.n_ms_last_action_call = n_ms_last_action_call
    }
}
let a_a_b_down__layout = [
    [
        1,0,0,0,
        0,0,0,0
    ]
]
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
        (b_down)=>{
            f_emit_keydown(b_down,s_char_key_to_emit)
        }, 
        0
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
let f_emit_keydown = function(b_down, s_char_key){

    // var event = new KeyboardEvent('keydown', {
    //     key: s_char_key,
    //     // keyCode: keyCode,
    //     bubbles: true,
    //     cancelable: true
    // });
    // document.dispatchEvent(event);
    // custom events will have o.isTrusted == false, and will not reflect in inputs such as textareas and inputs...
    // therefore we have to render by our own
    
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
let n_ms_for_activation_hold = 300;
let n_ms_delta_to_count_as_tap_combo = 60;
let a_a_o_key_action = [ // aka layers
    [
        ...a_s_text.map((s,n_idx)=>{

            let f = (b_down)=>{f_emit_keydown(b_down,s)};
            if(s == 'a'){
                f = (b_down)=>{
                    if(b_down){
                        o_state.a_o_key_action = o_state.a_a_o_key_action[1]
                    }else{
                        o_state.a_o_key_action = o_state.a_a_o_key_action[0]
                    }
                    //layer switch
                }
            }
            return new O_key_action(
                a_s_char_key[n_idx],
                true,
                false,
                n_ms_for_activation_hold,
                n_ms_delta_to_count_as_tap_combo,
                f, 
                0
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

    [
        ...a_s_text.map((s,n_idx)=>{
            return new O_key_action(
                a_s_char_key[n_idx],
                true,
                false,
                n_ms_for_activation_hold,
                n_ms_delta_to_count_as_tap_combo,
                (b_down)=>{
                    f_emit_keydown(b_down,s)
                },
                0
            )
        }),
        ...[
            '', '(', '{', '}',
            '', '[', ']', '}'
        ].map((s,n_idx)=>{
            if(s.trim() == ''){
                return false
            }
            return new O_key_action(
                a_s_char_key[n_idx],
                true,
                false,
                n_ms_for_activation_hold,
                n_ms_delta_to_count_as_tap_combo,
                (b_down)=>{
                    f_emit_keydown(b_down,s)
                },
                0
            )
        }).filter(v=>v),
    ],
];
let o_state = {
    n_ms_max_keyaction_repeat_start: 200,
    n_ms_max_keyaction_repeat: 30,
    s_text_input: '',
    n_ms_timeout_for_check_actions: 50, 
    n_id_timeout: 0,
    a_a_o_key_action: a_a_o_key_action, 
    a_o_key_action: a_a_o_key_action[0],
    o_scl: o_scl,
    a_s_text: a_s_text,
    n_ms_delta_to_count_as_single_key: 60,
    a_o_event: [], 
    a_o_event: [],
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
                                    s_tag: "canvas"
                                },
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
                                                                        (o_state.a_o_event.find(o=>{
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
    let a_o_event_down = o_state.a_o_event.filter(
        o=>{
            return o.b_down
        }
    ).sort(
        (o1, o2)=>{
            return o2.n_ms_wpn_down - o1.n_ms_wpn_down
        }
    );


    // if a key or a key group is pressed and released quickly it has to emit the 'tap' event
    o_state.a_o_event.filter(
        o=>{
            return !o.b_down && o.b_down_last
        }
    ).forEach(o=>{
        console.log('here')
        let o_key_action = o_state.a_o_key_action.find(
            o2=>{
                return o2.a_s_char_key.length == 1 && o2.a_s_char_key.includes(o.s_char_key)
            }
        );
        if(o_key_action){
            o_key_action.f_action(false)
            o.b_down_last = o.b_down
        }
    })

    // we now group the down events 
    // two grouped keypressed could be done with a certain 
    // margin to each other for example 
    // AR(f)....... TS(J).....
    let a_a_o_event_down = []
    if(a_o_event_down.length > 0){

        a_a_o_event_down = [
            [a_o_event_down[0]]
        ];
        for(let o of a_o_event_down.slice(1)){
            let b_connected = 
                Math.abs(a_a_o_event_down.at(-1)[0].n_ms_wpn_down - o.n_ms_wpn_down) < o_state.n_ms_delta_to_count_as_single_key
            if(b_connected){
                a_a_o_event_down.at(-1).push(o)
            }else{
                a_a_o_event_down.push(
                    [o]
                )
            }
        }
    }
    console.log(a_a_o_event_down)

    for(let a_o_event_down of a_a_o_event_down){

        let a_o_key_action = o_state.a_o_key_action.filter(o=>{
            return o.a_s_char_key.length == a_o_event_down.length
                && ! a_o_event_down.find(o2=>{
                    return !o.a_s_char_key.includes(o2.s_char_key)
                })
        });

        let n_ms_wpn = window.performance.now()
        for(let o_key_action of a_o_key_action){
            if(Math.abs(n_ms_wpn - o_key_action.n_ms_last_action_call) > 200){
                o_key_action.f_action(true);
                o_key_action.n_ms_last_action_call = n_wpn;
            }
        }
    }



}

let f_fix_alt_tab_bug = function(
    b_alt_pressed
){
    // on linux there is a bug 
    // Problem: keyup event for 'alt left' is not triggered when swiching
    // from a other application for example vscode to the chrome browser
    

    // therefore we have to double check if the alt key is pressed and update the event accordingly
    let o_event__alt = o_state.a_o_event.find(o=>o.s_char_key.toLowerCase() == 'alt')
    if(o_event__alt){
        o_event__alt.b_down = b_alt_pressed;
    }
}
let f_custom_key_press_event = async function(o_e){
    if(o_e.isTrusted ){ //dont catch emulated events
        let b_down = o_e.type == 'keydown'
        let o_event = new O_event(
            o_e.key,
            b_down,
            [],
            [], 
            false,
            false, 
            10
        )
        f_fix_alt_tab_bug(o_e.altKey)

        let o_event_existing = o_state.a_o_event.find(o=>{
            return o.s_char_key == o_event.s_char_key
        });
        // by default the down event is emitted several times if a key is held down, but we handle this in our custom raf 
        if(o_event_existing?.b_down && b_down){
            o_e.stopPropagation();
            o_e.preventDefault();
            return;
        }
        if(!o_event_existing){
            o_state.a_o_event.push(o_event);
            o_event_existing = o_event
        }
        if(b_down){
            o_event_existing.b_grouped = false
        }
        o_event_existing.b_down = b_down
        o_event_existing.b_key_action_fired = b_down
        let b_circular_insert_at_beginning = true;
        f_a_v_add_v_circular_to_array(
            o_event_existing[(b_down) ? 'a_n_ms_wpn_down' : 'a_n_ms_wpn_up'],
            window.performance.now(),
            o_event.n_len_max_a_n_ms,
            b_circular_insert_at_beginning
        )
        let n_idx_a_o_key = a_s_char_key.indexOf(o_e.key);
        if(n_idx_a_o_key != -1){
            a_o_key[n_idx_a_o_key*4+0] = (o_event.b_down) ? 1.0 : 0.0
        }
        // clearTimeout(o_state.n_id_timeout);
        // o_state.n_id_timeout = window.setTimeout(
        //     ()=>{
        //         f_check_and_potentially_execute_actions();
        //     }, 
        //     o_state.n_ms_timeout_for_check_actions
        // )
        await o_state?.o_js__a_o_key._f_render();
        o_e.stopPropagation();
        o_e.preventDefault();
    }
}
let n_id_raf = 0; 
let n_ms_max = 1000/120; //30 fps
let n_wpn = 0;
let n_wpn_last = 0;
let f_raf = function(){
    n_id_raf = window.requestAnimationFrame(f_raf)
    n_wpn = window.performance.now();
    if(Math.abs(n_wpn-n_wpn_last)> n_ms_max){
        n_wpn_last = n_wpn;
        f_check_and_potentially_execute_actions();
    }
    // check what keys are down, 
    // check if there are some groups 
    if(o_gpu_gateway){
        if(
            o_location__a_o_trn
        ){
            gl.uniform4fv(o_location__a_o_trn, a_o_key);
        }
        f_update_data_in_o_gpu_gateway(
            {
                n_ms_time: window.performance.now(),    // "uniform float n_ms_time"
            },
            o_gpu_gateway
        );
        f_render_o_gpu_gateway(
            o_gpu_gateway
        );
    }
}
n_id_raf = window.requestAnimationFrame(f_raf)

document.addEventListener('DOMContentLoaded', function() {
    var textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  });


  //gpu stuff 

//--------------


n_len_a_o_key = o_scl.compsmul(); 
a_o_key = new Float32Array(n_len_a_o_key*4);

let o_canvas = document.querySelector('canvas');
o_canvas.width = 300
o_canvas.height = 150
o_gpu_gateway = f_o_gpu_gateway(
    o_canvas, 
    `#version 300 es
    in vec4 a_o_vec_position_vertex;
    out vec2 o_trn_nor_pixel;
    void main() {
        gl_Position = a_o_vec_position_vertex;
        o_trn_nor_pixel = (a_o_vec_position_vertex.xy + 1.0) / 2.0; // Convert from clip space to texture coordinates
    }`,
    `#version 300 es
    precision mediump float;
    // incoming variables
    in vec2 o_trn_nor_pixel;
    // outgoing variables
    out vec4 fragColor;
    // data passed from javascript 
    uniform float n_ms_time;
    uniform vec2 o_trn_nor_mouse;
    uniform vec4 a_o_key[${n_len_a_o_key}];
    float f_n_dist_square(
        vec2 o
    ){
        return max(abs(o.x), abs(o.y));
    }
    float f_n_dist_squircle(
        vec2 o, float n_interpolation_value
    ){
        float n1 = f_n_dist_square(o)-.5;
        float n2 = length(o)-.5;
        return n_interpolation_value * n1 + (1.-n_interpolation_value)*n2;
        // return n1;
    }
    void main() {
        float n = length(o_trn_nor_pixel-o_trn_nor_mouse);
        float n_o_scl_compsmul = ${n_len_a_o_key}.;
        vec2 o_scl = vec2(${o_scl.a_n_comp.toString()});
        vec2 o_trn_scld = o_trn_nor_pixel * o_scl;
        vec2 o_trn_scld_fract = (fract(o_trn_scld)-.5);
        vec2 o_trn_scld_floor = (floor(o_trn_scld));
        float n_len = (f_n_dist_squircle(
            o_trn_scld_fract*1.3, 
            .3
        ));
        float n_t = n_ms_time*0.001;
        float b_mask_inside = (n_len > 0.) ? 0.: 1.;
        float n_sin_animation = sin(n_len*33.+n_t);
        n_sin_animation = pow(n_sin_animation,2.);
        float n_sin_anim_masked = n_sin_animation*b_mask_inside;
        n_len = abs(n_len);
        n_len = pow(n_len,1./4.);
        n_len = 1.-n_len;
        float n_idx = o_trn_scld_floor.x+(((o_scl.y-1.)-o_trn_scld_floor.y)*o_scl.x);
        // n_idx = n_o_scl_compsmul- n_idx;
        float b_down = a_o_key[int(n_idx)].x; 
        // b_down = 1.;
        fragColor = vec4(
            // vec3(
            //     n_idx/8.
            // ),
            vec3(n_len+n_sin_anim_masked*b_down),
            // fract(o_trn_scld.xyx),
            1.
        );
    }
    `,
)

let gl = o_gpu_gateway.o_ctx;
let program = o_gpu_gateway.o_shader__program;
// Get the location of the uniform array in the shader program
o_location__a_o_trn = gl.getUniformLocation(program, 'a_o_key');
// Set the uniform array values
gl.uniform4fv(o_location__a_o_trn, a_o_key);

//----------------------------------