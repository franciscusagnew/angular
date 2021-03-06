/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, ContentChild, Directive, Injectable, Input, NgModule, OnDestroy, Optional, Pipe, PipeTransform, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef} from '../../src/core';
import * as $r3$ from '../../src/core_render3_private_export';

import {renderComponent, toHtml} from './render_util';

/**
 * NORMATIVE => /NORMATIVE: Designates what the compiler is expected to generate.
 *
 * All local variable names are considered non-normative (informative). They should be
 * wrapped in $ on each end to simplify testing on the compiler side.
 */

describe('compiler specification', () => {
  // Saving type as $boolean$, etc to simplify testing for compiler, as types aren't saved
  type $boolean$ = boolean;
  type $any$ = any;
  type $number$ = number;

  describe('elements', () => {
    it('should translate DOM structure', () => {
      type $MyComponent$ = MyComponent;

      // Important: keep arrays outside of function to not create new instances.
      const $e0_attrs$ = ['class', 'my-app', 'title', 'Hello'];

      @Component({
        selector: 'my-component',
        template: `<div class="my-app" title="Hello">Hello <b>World</b>!</div>`
      })
      class MyComponent {
        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: MyComponent,
          tag: 'my-component',
          factory: () => new MyComponent(),
          template: function(ctx: $MyComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵE(0, 'div', $e0_attrs$);
              $r3$.ɵT(1, 'Hello ');
              $r3$.ɵE(2, 'b');
              $r3$.ɵT(3, 'World');
              $r3$.ɵe();
              $r3$.ɵT(4, '!');
              $r3$.ɵe();
            }
          }
        });
        // /NORMATIVE
      }

      expect(renderComp(MyComponent))
          .toEqual('<div class="my-app" title="Hello">Hello <b>World</b>!</div>');
    });
  });

  describe('components & directives', () => {
    it('should instantiate directives', () => {
      type $ChildComponent$ = ChildComponent;
      type $MyComponent$ = MyComponent;

      const log: string[] = [];
      @Component({selector: 'child', template: 'child-view'})
      class ChildComponent {
        constructor() { log.push('ChildComponent'); }
        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: ChildComponent,
          tag: `child`,
          factory: () => new ChildComponent(),
          template: function(ctx: $ChildComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵT(0, 'child-view');
            }
          }
        });
        // /NORMATIVE
      }

      @Directive({
        selector: '[some-directive]',
      })
      class SomeDirective {
        constructor() { log.push('SomeDirective'); }
        // NORMATIVE
        static ngDirectiveDef = $r3$.ɵdefineDirective({
          type: SomeDirective,
          factory: () => new SomeDirective(),
        });
        // /NORMATIVE
      }

      // Important: keep arrays outside of function to not create new instances.
      // NORMATIVE
      const $e0_attrs$ = ['some-directive', ''];
      const $e0_dirs$ = [SomeDirective];
      // /NORMATIVE

      @Component({selector: 'my-component', template: `<child some-directive></child>!`})
      class MyComponent {
        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: MyComponent,
          tag: 'my-component',
          factory: () => new MyComponent(),
          template: function(ctx: $MyComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵE(0, ChildComponent, $e0_attrs$, $e0_dirs$);
              $r3$.ɵe();
              $r3$.ɵT(3, '!');
            }
            ChildComponent.ngComponentDef.h(1, 0);
            SomeDirective.ngDirectiveDef.h(2, 0);
            $r3$.ɵr(1, 0);
            $r3$.ɵr(2, 0);
          }
        });
        // /NORMATIVE
      }

      expect(renderComp(MyComponent)).toEqual('<child some-directive="">child-view</child>!');
      expect(log).toEqual(['ChildComponent', 'SomeDirective']);
    });

    xit('should support structural directives', () => {
      type $MyComponent$ = MyComponent;

      const log: string[] = [];
      @Directive({
        selector: '[if]',
      })
      class IfDirective {
        constructor(template: TemplateRef<any>) { log.push('ifDirective'); }
        // NORMATIVE
        static ngDirectiveDef = $r3$.ɵdefineDirective({
          type: IfDirective,
          factory: () => new IfDirective($r3$.ɵinjectTemplateRef()),
        });
        // /NORMATIVE
      }

      // Important: keep arrays outside of function to not create new instances.
      // NORMATIVE
      const $e0_locals$ = ['foo', ''];
      const $c1_dirs$ = [IfDirective];
      // /NORMATIVE

      @Component(
          {selector: 'my-component', template: `<ul #foo><li *if>{{salutation}} {{foo}}</li></ul>`})
      class MyComponent {
        salutation = 'Hello';
        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: MyComponent,
          tag: 'my-component',
          factory: () => new MyComponent(),
          template: function(ctx: $MyComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵE(0, 'ul', null, null, $e0_locals$);
              $r3$.ɵC(2, $c1_dirs$, C1);
              $r3$.ɵe();
            }
            let $foo$ = $r3$.ɵm<any>(1);
            $r3$.ɵcR(2);
            $r3$.ɵr(3, 2);
            $r3$.ɵcr();

            function C1(ctx1: $any$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, 'li');
                $r3$.ɵT(1);
                $r3$.ɵe();
              }
              $r3$.ɵt(1, $r3$.ɵi2('', ctx.salutation, ' ', $foo$, ''));
            }
          }
        });
        // /NORMATIVE
      }

      expect(renderComp(MyComponent)).toEqual('<child some-directive="">child-view</child>!');
      expect(log).toEqual(['ChildComponent', 'SomeDirective']);
    });

    describe('value composition', () => {

      it('should support array literals', () => {
        type $MyComp$ = MyComp;
        type $MyApp$ = MyApp;

        @Component({
          selector: 'my-comp',
          template: `
            <p>{{ names[0] }}</p>
            <p>{{ names[1] }}</p>
          `
        })
        class MyComp {
          @Input() names: string[];

          static ngComponentDef = $r3$.ɵdefineComponent({
            type: MyComp,
            tag: 'my-comp',
            factory: function MyComp_Factory() { return new MyComp(); },
            template: function MyComp_Template(ctx: $MyComp$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, 'p');
                $r3$.ɵT(1);
                $r3$.ɵe();
                $r3$.ɵE(2, 'p');
                $r3$.ɵT(3);
                $r3$.ɵe();
              }
              $r3$.ɵt(1, $r3$.ɵb(ctx.names[0]));
              $r3$.ɵt(3, $r3$.ɵb(ctx.names[1]));
            },
            inputs: {names: 'names'}
          });
        }

        // NORMATIVE
        const $e0_ff$ = (v: any) => ['Nancy', v];
        // /NORMATIVE

        @Component({
          selector: 'my-app',
          template: `
          <my-comp [names]="['Nancy', customName]"></my-comp>
        `
        })
        class MyApp {
          customName = 'Bess';

          // NORMATIVE
          static ngComponentDef = $r3$.ɵdefineComponent({
            type: MyApp,
            tag: 'my-app',
            factory: function MyApp_Factory() { return new MyApp(); },
            template: function MyApp_Template(ctx: $MyApp$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, MyComp);
                $r3$.ɵe();
              }
              $r3$.ɵp(0, 'names', $r3$.ɵo1($e0_ff$, ctx.customName));
              MyComp.ngComponentDef.h(1, 0);
              $r3$.ɵr(1, 0);
            }
          });
          // /NORMATIVE
        }

        expect(renderComp(MyApp)).toEqual(`<my-comp><p>Nancy</p><p>Bess</p></my-comp>`);
      });

      it('should support 9+ bindings in array literals', () => {
        type $MyComp$ = MyComp;

        @Component({
          selector: 'my-comp',
          template: `
            {{ names[0] }}
            {{ names[1] }}
            {{ names[3] }}
            {{ names[4] }}
            {{ names[5] }}
            {{ names[6] }}
            {{ names[7] }}
            {{ names[8] }}
            {{ names[9] }}
            {{ names[10] }}
            {{ names[11] }}
          `
        })
        class MyComp {
          @Input() names: string[];

          static ngComponentDef = $r3$.ɵdefineComponent({
            type: MyComp,
            tag: 'my-comp',
            factory: function MyComp_Factory() { return new MyComp(); },
            template: function MyComp_Template(ctx: $MyComp$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵT(0);
                $r3$.ɵT(1);
                $r3$.ɵT(2);
                $r3$.ɵT(3);
                $r3$.ɵT(4);
                $r3$.ɵT(5);
                $r3$.ɵT(6);
                $r3$.ɵT(7);
                $r3$.ɵT(8);
                $r3$.ɵT(9);
                $r3$.ɵT(10);
                $r3$.ɵT(11);
              }
              $r3$.ɵt(0, $r3$.ɵb(ctx.names[0]));
              $r3$.ɵt(1, $r3$.ɵb(ctx.names[1]));
              $r3$.ɵt(2, $r3$.ɵb(ctx.names[2]));
              $r3$.ɵt(3, $r3$.ɵb(ctx.names[3]));
              $r3$.ɵt(4, $r3$.ɵb(ctx.names[4]));
              $r3$.ɵt(5, $r3$.ɵb(ctx.names[5]));
              $r3$.ɵt(6, $r3$.ɵb(ctx.names[6]));
              $r3$.ɵt(7, $r3$.ɵb(ctx.names[7]));
              $r3$.ɵt(8, $r3$.ɵb(ctx.names[8]));
              $r3$.ɵt(9, $r3$.ɵb(ctx.names[9]));
              $r3$.ɵt(10, $r3$.ɵb(ctx.names[10]));
              $r3$.ɵt(11, $r3$.ɵb(ctx.names[11]));
            },
            inputs: {names: 'names'}
          });
        }

        // NORMATIVE
        const $e0_ff$ = (v: any[]) =>
            ['start-', v[0], v[1], v[2], v[3], v[4], '-middle-', v[5], v[6], v[7], v[8], '-end'];
        // /NORMATIVE

        @Component({
          selector: 'my-app',
          template: `
          <my-comp [names]="['start-', n0, n1, n2, n3, n4, '-middle-', n5, n6, n7, n8, '-end']">
          </my-comp>
        `
        })
        class MyApp {
          n0 = 'a';
          n1 = 'b';
          n2 = 'c';
          n3 = 'd';
          n4 = 'e';
          n5 = 'f';
          n6 = 'g';
          n7 = 'h';
          n8 = 'i';

          // NORMATIVE
          static ngComponentDef = $r3$.ɵdefineComponent({
            type: MyApp,
            tag: 'my-app',
            factory: function MyApp_Factory() { return new MyApp(); },
            template: function MyApp_Template(c: MyApp, cm: boolean) {
              if (cm) {
                $r3$.ɵE(0, MyComp);
                $r3$.ɵe();
              }
              $r3$.ɵp(
                  0, 'names',
                  $r3$.ɵoV($e0_ff$, [c.n0, c.n1, c.n2, c.n3, c.n4, c.n5, c.n6, c.n7, c.n8]));
              MyComp.ngComponentDef.h(1, 0);
              $r3$.ɵr(1, 0);
            }
          });
          // /NORMATIVE
        }

        expect(renderComp(MyApp)).toEqual(`<my-comp>start-abcde-middle-fghi-end</my-comp>`);
      });

      it('should support object literals', () => {
        type $ObjectComp$ = ObjectComp;
        type $MyApp$ = MyApp;

        @Component({
          selector: 'object-comp',
          template: `
            <p> {{ config['duration'] }} </p>
            <p> {{ config.animation }} </p>
          `
        })
        class ObjectComp {
          config: {[key: string]: any};

          static ngComponentDef = $r3$.ɵdefineComponent({
            type: ObjectComp,
            tag: 'object-comp',
            factory: function ObjectComp_Factory() { return new ObjectComp(); },
            template: function ObjectComp_Template(ctx: $ObjectComp$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, 'p');
                $r3$.ɵT(1);
                $r3$.ɵe();
                $r3$.ɵE(2, 'p');
                $r3$.ɵT(3);
                $r3$.ɵe();
              }
              $r3$.ɵt(1, $r3$.ɵb(ctx.config['duration']));
              $r3$.ɵt(3, $r3$.ɵb(ctx.config.animation));
            },
            inputs: {config: 'config'}
          });
        }

        // NORMATIVE
        const $e0_ff$ = (v: any) => { return {'duration': 500, animation: v}; };
        // /NORMATIVE

        @Component({
          selector: 'my-app',
          template: `
          <object-comp [config]="{'duration': 500, animation: name}"></object-comp>
        `
        })
        class MyApp {
          name = 'slide';

          // NORMATIVE
          static ngComponentDef = $r3$.ɵdefineComponent({
            type: MyApp,
            tag: 'my-app',
            factory: function MyApp_Factory() { return new MyApp(); },
            template: function MyApp_Template(ctx: $MyApp$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, ObjectComp);
                $r3$.ɵe();
              }
              $r3$.ɵp(0, 'config', $r3$.ɵo1($e0_ff$, ctx.name));
              ObjectComp.ngComponentDef.h(1, 0);
              $r3$.ɵr(1, 0);
            }
          });
          // /NORMATIVE
        }

        expect(renderComp(MyApp)).toEqual(`<object-comp><p>500</p><p>slide</p></object-comp>`);
      });

      it('should support expressions nested deeply in object/array literals', () => {
        type $NestedComp$ = NestedComp;
        type $MyApp$ = MyApp;

        @Component({
          selector: 'nested-comp',
          template: `
            <p> {{ config.animation }} </p>
            <p> {{config.actions[0].opacity }} </p>
            <p> {{config.actions[1].duration }} </p>
          `
        })
        class NestedComp {
          config: {[key: string]: any};

          static ngComponentDef = $r3$.ɵdefineComponent({
            type: NestedComp,
            tag: 'nested-comp',
            factory: function NestedComp_Factory() { return new NestedComp(); },
            template: function NestedComp_Template(ctx: $NestedComp$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, 'p');
                $r3$.ɵT(1);
                $r3$.ɵe();
                $r3$.ɵE(2, 'p');
                $r3$.ɵT(3);
                $r3$.ɵe();
                $r3$.ɵE(4, 'p');
                $r3$.ɵT(5);
                $r3$.ɵe();
              }
              $r3$.ɵt(1, $r3$.ɵb(ctx.config.animation));
              $r3$.ɵt(3, $r3$.ɵb(ctx.config.actions[0].opacity));
              $r3$.ɵt(5, $r3$.ɵb(ctx.config.actions[1].duration));
            },
            inputs: {config: 'config'}
          });
        }

        // NORMATIVE
        const $e0_ff$ = (v: any) => { return {opacity: 1, duration: v}; };
        const $c0$ = {opacity: 0, duration: 0};
        const $e0_ff_1$ = (v: any) => [$c0$, v];
        const $e0_ff_2$ = (v1: any, v2: any) => { return {animation: v1, actions: v2}; };
        // /NORMATIVE

        @Component({
          selector: 'my-app',
          template: `
          <nested-comp [config]="{animation: name, actions: [{ opacity: 0, duration: 0}, {opacity: 1, duration: duration }]}">
          </nested-comp>
        `
        })
        class MyApp {
          name = 'slide';
          duration = 100;

          // NORMATIVE
          static ngComponentDef = $r3$.ɵdefineComponent({
            type: MyApp,
            tag: 'my-app',
            factory: function MyApp_Factory() { return new MyApp(); },
            template: function MyApp_Template(ctx: $MyApp$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, NestedComp);
                $r3$.ɵe();
              }
              $r3$.ɵp(
                  0, 'config',
                  $r3$.ɵo2(
                      $e0_ff_2$, ctx.name, $r3$.ɵo1($e0_ff_1$, $r3$.ɵo1($e0_ff$, ctx.duration))));
              NestedComp.ngComponentDef.h(1, 0);
              $r3$.ɵr(1, 0);
            }
          });
          // /NORMATIVE
        }

        expect(renderComp(MyApp))
            .toEqual(`<nested-comp><p>slide</p><p>0</p><p>100</p></nested-comp>`);
      });

    });

    it('should support content projection', () => {
      type $SimpleComponent$ = SimpleComponent;
      type $ComplexComponent$ = ComplexComponent;
      type $MyApp$ = MyApp;

      @Component({selector: 'simple', template: `<div><ng-content></ng-content></div>`})
      class SimpleComponent {
        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: SimpleComponent,
          tag: 'simple',
          factory: () => new SimpleComponent(),
          template: function(ctx: $SimpleComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵpD(0);
              $r3$.ɵE(1, 'div');
              $r3$.ɵP(2, 0);
              $r3$.ɵe();
            }
          }
        });
        // /NORMATIVE
      }

      // NORMATIVE
      const $pD_0$: $r3$.ɵCssSelector[] =
          [[[['span', 'title', 'toFirst'], null]], [[['span', 'title', 'toSecond'], null]]];
      // /NORMATIVE

      @Component({
        selector: 'complex',
        template: `
        <div id="first"><ng-content select="span[title=toFirst]"></ng-content></div>
        <div id="second"><ng-content select="span[title=toSecond]"></ng-content></div>`
      })
      class ComplexComponent {
        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: ComplexComponent,
          tag: 'complex',
          factory: () => new ComplexComponent(),
          template: function(ctx: $ComplexComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵpD(0, $pD_0$);
              $r3$.ɵE(1, 'div', ['id', 'first']);
              $r3$.ɵP(2, 0, 1);
              $r3$.ɵe();
              $r3$.ɵE(3, 'div', ['id', 'second']);
              $r3$.ɵP(4, 0, 2);
              $r3$.ɵe();
            }
          }
        });
        // /NORMATIVE
      }

      @Component({
        selector: 'my-app',
        template: `<simple>content</simple>
        <complex></complex>`
      })
      class MyApp {
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: MyApp,
          tag: 'my-app',
          factory: () => new MyApp(),
          template: function(ctx: $MyApp$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵE(0, SimpleComponent);
              $r3$.ɵT(2, 'content');
              $r3$.ɵe();
            }
          }
        });
      }
    });

    describe('queries', () => {
      let someDir: SomeDirective;

      @Directive({
        selector: '[someDir]',
      })
      class SomeDirective {
        static ngDirectiveDef = $r3$.ɵdefineDirective({
          type: SomeDirective,
          factory: function SomeDirective_Factory() { return someDir = new SomeDirective(); },
          features: [$r3$.ɵPublicFeature]
        });
      }

      it('should support view queries', () => {
        type $ViewQueryComponent$ = ViewQueryComponent;

        // NORMATIVE
        const $e1_attrs$ = ['someDir', ''];
        const $e1_dirs$ = [SomeDirective];
        // /NORMATIVE

        @Component({
          selector: 'view-query-component',
          template: `
          <div someDir></div>
        `
        })
        class ViewQueryComponent {
          @ViewChild(SomeDirective) someDir: SomeDirective;


          // NORMATIVE
          static ngComponentDef = $r3$.ɵdefineComponent({
            type: ViewQueryComponent,
            tag: 'view-query-component',
            factory: function ViewQueryComponent_Factory() { return new ViewQueryComponent(); },
            template: function ViewQueryComponent_Template(
                ctx: $ViewQueryComponent$, cm: $boolean$) {
              let $tmp$: any;
              if (cm) {
                $r3$.ɵQ(0, SomeDirective, false);
                $r3$.ɵE(1, 'div', $e1_attrs$, $e1_dirs$);
                $r3$.ɵe();
              }
              $r3$.ɵqR($tmp$ = $r3$.ɵm<QueryList<any>>(0)) &&
                  (ctx.someDir = $tmp$ as QueryList<any>);
              SomeDirective.ngDirectiveDef.h(2, 1);
              $r3$.ɵr(2, 1);
            }
          });
          // /NORMATIVE
        }


        const viewQueryComp = renderComponent(ViewQueryComponent);
        expect((viewQueryComp.someDir as QueryList<SomeDirective>).toArray()).toEqual([someDir !]);
      });

      it('should support content queries', () => {
        type $MyApp$ = MyApp;
        type $ContentQueryComponent$ = ContentQueryComponent;

        let contentQueryComp: ContentQueryComponent;

        @Component({
          selector: 'content-query-component',
          template: `
            <div><ng-content></ng-content></div>
          `
        })
        class ContentQueryComponent {
          @ContentChild(SomeDirective) someDir: SomeDirective;

          // NORMATIVE
          static ngComponentDef = $r3$.ɵdefineComponent({
            type: ContentQueryComponent,
            tag: 'content-query-component',
            factory: function ContentQueryComponent_Factory() {
              return [new ContentQueryComponent(), $r3$.ɵQ(null, SomeDirective, false)];
            },
            hostBindings: function ContentQueryComponent_HostBindings(
                dirIndex: $number$, elIndex: $number$) {
              let $tmp$: any;
              $r3$.ɵqR($tmp$ = $r3$.ɵm<any[]>(dirIndex)[1]) &&
                  ($r3$.ɵm<any[]>(dirIndex)[0].someDir = $tmp$);
            },
            template: function ContentQueryComponent_Template(
                ctx: $ContentQueryComponent$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵpD(0);
                $r3$.ɵE(1, 'div');
                $r3$.ɵP(2, 0);
                $r3$.ɵe();
              }
            }
          });
          // /NORMATIVE
        }

        const $e2_attrs$ = ['someDir', ''];
        const $e2_dirs$ = [SomeDirective];

        @Component({
          selector: 'my-app',
          template: `
            <content-query-component>
              <div someDir></div>
            </content-query-component>
          `
        })
        class MyApp {
          // NON-NORMATIVE
          static ngComponentDef = $r3$.ɵdefineComponent({
            type: MyApp,
            tag: 'my-app',
            factory: function MyApp_Factory() { return new MyApp(); },
            template: function MyApp_Template(ctx: $MyApp$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, ContentQueryComponent);
                contentQueryComp = $r3$.ɵm<any[]>(1)[0];
                $r3$.ɵE(2, 'div', $e2_attrs$, $e2_dirs$);
                $r3$.ɵe();
                $r3$.ɵe();
              }
              ContentQueryComponent.ngComponentDef.h(1, 0);
              SomeDirective.ngDirectiveDef.h(3, 2);
              $r3$.ɵr(1, 0);
              $r3$.ɵr(3, 2);
            }
          });
          // /NON-NORMATIVE
        }


        expect(renderComp(MyApp))
            .toEqual(
                `<content-query-component><div><div somedir=""></div></div></content-query-component>`);
        expect((contentQueryComp !.someDir as QueryList<SomeDirective>).toArray()).toEqual([
          someDir !
        ]);
      });

    });

  });

  xdescribe('pipes', () => {
    type $MyApp$ = MyApp;

    @Pipe({
      name: 'myPipe',
      pure: false,
    })
    class MyPipe implements PipeTransform,
        OnDestroy {
      transform(value: any, ...args: any[]) { throw new Error('Method not implemented.'); }
      ngOnDestroy(): void { throw new Error('Method not implemented.'); }

      // NORMATIVE
      static ngPipeDef = $r3$.ɵdefinePipe({
        type: MyPipe,
        factory: function MyPipe_Factory() { return new MyPipe(); },
        pure: false,
      });
      // /NORMATIVE
    }

    @Pipe({
      name: 'myPurePipe',
    })
    class MyPurePipe implements PipeTransform {
      transform(value: any, ...args: any[]) { throw new Error('Method not implemented.'); }

      // NORMATIVE
      static ngPipeDef = $r3$.ɵdefinePipe({
        type: MyPurePipe,
        factory: function MyPurePipe_Factory() { return new MyPurePipe(); },
      });
      // /NORMATIVE
    }

    // NORMATIVE
    const $MyPurePipe_ngPipeDef$ = MyPurePipe.ngPipeDef;
    const $MyPipe_ngPipeDef$ = MyPipe.ngPipeDef;
    // /NORMATIVE

    @Component({template: `{{name | myPipe:size | myPurePipe:size }}`})
    class MyApp {
      name = 'World';
      size = 0;

      // NORMATIVE
      static ngComponentDef = $r3$.ɵdefineComponent({
        type: MyApp,
        tag: 'my-app',
        factory: function MyApp_Factory() { return new MyApp(); },
        template: function MyApp_Template(ctx: $MyApp$, cm: $boolean$) {
          if (cm) {
            $r3$.ɵT(0);
            $r3$.ɵPp(1, $MyPurePipe_ngPipeDef$, $MyPurePipe_ngPipeDef$.n());
            $r3$.ɵPp(2, $MyPipe_ngPipeDef$, $MyPipe_ngPipeDef$.n());
          }
          $r3$.ɵt(2, $r3$.ɵi1('', $r3$.ɵpb2(1, $r3$.ɵpb2(2, ctx.name, ctx.size), ctx.size), ''));
        }
      });
      // /NORMATIVE
    }

    it('should render pipes', () => {
                                  // TODO(misko): write a test once pipes runtime is implemented.
                              });
  });

  describe('local references', () => {
    // TODO(misko): currently disabled until local refs are working
    xit('should translate DOM structure', () => {
      type $MyComponent$ = MyComponent;

      @Component({selector: 'my-component', template: `<input #user>Hello {{user.value}}!`})
      class MyComponent {
        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: MyComponent,
          tag: 'my-component',
          factory: () => new MyComponent,
          template: function(ctx: $MyComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵE(0, 'input', null, null, ['user', '']);
              $r3$.ɵe();
              $r3$.ɵT(2);
            }
            const l1_user = $r3$.ɵm<any>(1);
            $r3$.ɵt(2, $r3$.ɵi1('Hello ', l1_user.value, '!'));
          }
        });
        // NORMATIVE
      }

      expect(renderComp(MyComponent))
          .toEqual('<div class="my-app" title="Hello">Hello <b>World</b>!</div>');
    });
  });

  describe('lifecycle hooks', () => {
    let events: string[] = [];
    let simpleLayout: SimpleLayout;

    type $LifecycleComp$ = LifecycleComp;
    type $SimpleLayout$ = SimpleLayout;

    beforeEach(() => { events = []; });

    @Component({selector: 'lifecycle-comp', template: ``})
    class LifecycleComp {
      @Input('name') nameMin: string;

      ngOnChanges() { events.push('changes' + this.nameMin); }

      ngOnInit() { events.push('init' + this.nameMin); }
      ngDoCheck() { events.push('check' + this.nameMin); }

      ngAfterContentInit() { events.push('content init' + this.nameMin); }
      ngAfterContentChecked() { events.push('content check' + this.nameMin); }

      ngAfterViewInit() { events.push('view init' + this.nameMin); }
      ngAfterViewChecked() { events.push('view check' + this.nameMin); }

      ngOnDestroy() { events.push(this.nameMin); }

      // NORMATIVE
      static ngComponentDef = $r3$.ɵdefineComponent({
        type: LifecycleComp,
        tag: 'lifecycle-comp',
        factory: function LifecycleComp_Factory() { return new LifecycleComp(); },
        template: function LifecycleComp_Template(ctx: $LifecycleComp$, cm: $boolean$) {},
        inputs: {nameMin: 'name'},
        features: [$r3$.ɵNgOnChangesFeature]
      });
      // /NORMATIVE
    }

    @Component({
      selector: 'simple-layout',
      template: `
        <lifecycle-comp [name]="name1"></lifecycle-comp>
        <lifecycle-comp [name]="name2"></lifecycle-comp>
      `
    })
    class SimpleLayout {
      name1 = '1';
      name2 = '2';

      // NORMATIVE
      static ngComponentDef = $r3$.ɵdefineComponent({
        type: SimpleLayout,
        tag: 'simple-layout',
        factory: function SimpleLayout_Factory() { return simpleLayout = new SimpleLayout(); },
        template: function SimpleLayout_Template(ctx: $SimpleLayout$, cm: $boolean$) {
          if (cm) {
            $r3$.ɵE(0, LifecycleComp);
            $r3$.ɵe();
            $r3$.ɵE(2, LifecycleComp);
            $r3$.ɵe();
          }
          $r3$.ɵp(0, 'name', $r3$.ɵb(ctx.name1));
          $r3$.ɵp(2, 'name', $r3$.ɵb(ctx.name2));
          LifecycleComp.ngComponentDef.h(1, 0);
          LifecycleComp.ngComponentDef.h(3, 2);
          $r3$.ɵr(1, 0);
          $r3$.ɵr(3, 2);
        }
      });
      // /NORMATIVE
    }

    it('should gen hooks with a few simple components', () => {
      expect(renderComp(SimpleLayout))
          .toEqual(`<lifecycle-comp></lifecycle-comp><lifecycle-comp></lifecycle-comp>`);
      expect(events).toEqual([
        'changes1', 'init1', 'check1', 'changes2', 'init2', 'check2', 'content init1',
        'content check1', 'content init2', 'content check2', 'view init1', 'view check1',
        'view init2', 'view check2'
      ]);

      events = [];
      simpleLayout.name1 = '-one';
      simpleLayout.name2 = '-two';
      $r3$.ɵdetectChanges(simpleLayout);
      expect(events).toEqual([
        'changes-one', 'check-one', 'changes-two', 'check-two', 'content check-one',
        'content check-two', 'view check-one', 'view check-two'
      ]);
    });

  });

  describe('template variables', () => {

    interface ForOfContext {
      $implicit: any;
      index: number;
      even: boolean;
      odd: boolean;
    }

    @Directive({selector: '[forOf]'})
    class ForOfDirective {
      private previous: any[];

      constructor(private view: ViewContainerRef, private template: TemplateRef<any>) {}

      @Input() forOf: any[];

      ngOnChanges(simpleChanges: SimpleChanges) {
        if ('forOf' in simpleChanges) {
          this.update();
        }
      }

      ngDoCheck(): void {
        const previous = this.previous;
        const current = this.forOf;
        if (!previous || previous.length != current.length ||
            previous.some((value: any, index: number) => current[index] !== previous[index])) {
          this.update();
        }
      }

      private update() {
        // TODO(chuckj): Not implemented yet
        // this.view.clear();
        if (this.forOf) {
          const current = this.forOf;
          for (let i = 0; i < current.length; i++) {
            const context = {$implicit: current[i], index: i, even: i % 2 == 0, odd: i % 2 == 1};
            // TODO(chuckj): Not implemented yet
            // this.view.createEmbeddedView(this.template, context);
          }
          this.previous = [...this.forOf];
        }
      }

      // NORMATIVE
      static ngDirectiveDef = $r3$.ɵdefineDirective({
        type: ForOfDirective,
        factory: function ForOfDirective_Factory() {
          return new ForOfDirective($r3$.ɵinjectViewContainerRef(), $r3$.ɵinjectTemplateRef());
        },
        // TODO(chuckj): Enable when ngForOf enabling lands.
        // features: [NgOnChangesFeature(NgForOf)],
        inputs: {forOf: 'forOf'}
      });
      // /NORMATIVE
    }

    it('should support a let variable and reference', () => {
      type $MyComponent$ = MyComponent;

      interface Item {
        name: string;
      }

      // NORMATIVE
      const $c1_dirs$ = [ForOfDirective];
      // /NORMATIVE

      @Component({
        selector: 'my-component',
        template: `<ul><li *for="let item of items">{{item.name}}</li></ul>`
      })
      class MyComponent {
        items = [{name: 'one'}, {name: 'two'}];

        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: MyComponent,
          tag: 'my-component',
          factory: function MyComponent_Factory() { return new MyComponent(); },
          template: function MyComponent_Template(ctx: $MyComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵE(0, 'ul');
              $r3$.ɵC(1, $c1_dirs$, MyComponent_ForOfDirective_Template_1);
              $r3$.ɵe();
            }
            $r3$.ɵp(1, 'forOf', $r3$.ɵb(ctx.items));
            $r3$.ɵcR(1);
            $r3$.ɵr(2, 1);
            $r3$.ɵcr();

            function MyComponent_ForOfDirective_Template_1(ctx1: $any$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, 'li');
                $r3$.ɵT(1);
                $r3$.ɵe();
              }
              const $l0_item$ = ctx1.$implicit;
              $r3$.ɵt(1, $r3$.ɵi1('', $l0_item$.name, ''));
            }
          }
        });
        // /NORMATIVE
      }

      // TODO(chuckj): update when the changes to enable ngForOf lands.
      expect(renderComp(MyComponent)).toEqual('<ul></ul>');
    });

    it('should support accessing parent template variables', () => {
      type $MyComponent$ = MyComponent;

      interface Info {
        description: string;
      }
      interface Item {
        name: string;
        infos: Info[];
      }

      // NORMATIVE
      const $c1_dirs$ = [ForOfDirective];
      // /NORMATIVE

      @Component({
        selector: 'my-component',
        template: `
          <ul>
            <li *for="let item of items">
              <div>{{item.name}}</div>
              <ul>
                <li *for="let info of item.infos">
                  {{item.name}}: {{info.description}}
                </li>
              </ul>
            </li>
          </ul>`
      })
      class MyComponent {
        items: Item[] = [
          {name: 'one', infos: [{description: '11'}, {description: '12'}]},
          {name: 'two', infos: [{description: '21'}, {description: '22'}]}
        ];

        // NORMATIVE
        static ngComponentDef = $r3$.ɵdefineComponent({
          type: MyComponent,
          tag: 'my-component',
          factory: function MyComponent_Factory() { return new MyComponent(); },
          template: function MyComponent_Template(ctx: $MyComponent$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵE(0, 'ul');
              $r3$.ɵC(1, $c1_dirs$, MyComponent_ForOfDirective_Template_1);
              $r3$.ɵe();
            }
            $r3$.ɵp(1, 'forOf', $r3$.ɵb(ctx.items));
            $r3$.ɵcR(1);
            $r3$.ɵr(2, 1);
            $r3$.ɵcr();

            function MyComponent_ForOfDirective_Template_1(ctx1: $any$, cm: $boolean$) {
              if (cm) {
                $r3$.ɵE(0, 'li');
                $r3$.ɵE(1, 'div');
                $r3$.ɵT(2);
                $r3$.ɵe();
                $r3$.ɵE(3, 'ul');
                $r3$.ɵC(4, $c1_dirs$, MyComponent_ForOfDirective_ForOfDirective_Template_3);
                $r3$.ɵe();
                $r3$.ɵe();
              }
              const $l0_item$ = ctx1.$implicit;
              $r3$.ɵp(4, 'forOf', $r3$.ɵb($l0_item$.infos));
              $r3$.ɵt(2, $r3$.ɵi1('', $l0_item$.name, ''));
              $r3$.ɵcR(4);
              $r3$.ɵr(5, 4);
              $r3$.ɵcr();

              function MyComponent_ForOfDirective_ForOfDirective_Template_3(
                  ctx2: $any$, cm: $boolean$) {
                if (cm) {
                  $r3$.ɵE(0, 'li');
                  $r3$.ɵT(1);
                  $r3$.ɵe();
                }
                const $l0_info$ = ctx2.$implicit;
                $r3$.ɵt(1, $r3$.ɵi2(' ', $l0_item$.name, ': ', $l0_info$.description, ' '));
              }
            }
          }
        });
        // /NORMATIVE
      }
    });
  });
});

xdescribe('NgModule', () => {

  interface Injectable {
    scope?: /*InjectorDefType<any>*/ any;
    factory: Function;
  }

  function defineInjectable(opts: Injectable): Injectable {
    // This class should be imported from https://github.com/angular/angular/pull/20850
    return opts;
  }
  function defineInjector(opts: any): any {
    // This class should be imported from https://github.com/angular/angular/pull/20850
    return opts;
  }
  it('should convert module', () => {
    @Injectable()
    class Toast {
      constructor(name: String) {}
      // NORMATIVE
      static ngInjectableDef = defineInjectable({
        factory: () => new Toast($r3$.ɵinject(String)),
      });
      // /NORMATIVE
    }

    class CommonModule {
      // NORMATIVE
      static ngInjectorDef = defineInjector({});
      // /NORMATIVE
    }

    @NgModule({
      providers: [Toast, {provide: String, useValue: 'Hello'}],
      imports: [CommonModule],
    })
    class MyModule {
      constructor(toast: Toast) {}
      // NORMATIVE
      static ngInjectorDef = defineInjector({
        factory: () => new MyModule($r3$.ɵinject(Toast)),
        provider: [
          {provide: Toast, deps: [String]},  // If Toast has metadata generate this line
          Toast,                             // If Toast has no metadata generate this line.
          {provide: String, useValue: 'Hello'}
        ],
        imports: [CommonModule]
      });
      // /NORMATIVE
    }

    @Injectable(/*{MyModule}*/)
    class BurntToast {
      constructor(@Optional() toast: Toast|null, name: String) {}
      // NORMATIVE
      static ngInjectableDef = defineInjectable({
        scope: MyModule,
        factory: () => new BurntToast(
                     $r3$.ɵinject(Toast, $r3$.ɵInjectFlags.Optional), $r3$.ɵinject(String)),
      });
      // /NORMATIVE
    }

  });
});

function renderComp<T>(type: $r3$.ɵComponentType<T>): string {
  return toHtml(renderComponent(type));
}
