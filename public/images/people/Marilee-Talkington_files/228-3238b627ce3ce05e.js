"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[228],{12088:function(e,t,i){i.d(t,{C:function(){return I},Z:function(){return _}});var a=i(52322),n=i(10081);i(2784);var r=i(46138),o=i(23906),s=i(52154),l=i(24062),d=i(19596),c=i(86704);let m=`
    position: absolute;
    left: 50%;
    user-select: none;
    max-height: 100%;
    max-width: 100%;

    /* hide left/right image affordance when not on a touch device */
    ${c.mediaQueries.devices.onCursorScreens} {
        &.peek { display: none; }
    }
`,u=`
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 50%;
`,g=`
    top: 40%;
    transform: translate(-50%, -40%);
`,p=`
    top: 20%;
    transform: translate(-50%, -20%);
`,f=d.default.img.withConfig({componentId:"sc-b66608db-0"})([""," ",""],m,g),h=d.default.img.withConfig({componentId:"sc-b66608db-1"})([""," ",""],m,p),b=d.default.div.withConfig({componentId:"sc-b66608db-2"})([""," ",""],u,g),x=d.default.div.withConfig({componentId:"sc-b66608db-3"})([""," ",""],u,p),w=(0,n.ZP)`
    fragment MediaViewerImageMeta on Image {
        id
        url
        height
        width
        caption {
            plainText
        }
    }
`;function y(e,t){return e>t?{ImageElement:f,ContainerElement:b}:{ImageElement:h,ContainerElement:x}}let I=e=>{let{image:t,offset:i,prevImage:n,nextImage:d}=e,c=(0,r.Z)(),m=(0,o.wL)("MediaViewer_Image");if(!t||!t.url||!t.height||!t.width)return m.error("mediaviewer image missing required metadata",{id:t.id}),(0,a.jsx)(x,{className:"image-metadata-failure",children:(0,a.jsx)(l.F,{})});let u=y(t.height,t.width),g=u.ImageElement,p=u.ContainerElement,f=y(n?.height??0,n?.width??0),h=f.ImageElement,b=f.ContainerElement,w=y(d?.height??0,d?.width??0),I=w.ImageElement,_=w.ContainerElement,v=c.formatMessage({id:"mediaViewerImage_alt_missingCaption",defaultMessage:"Photo is missing caption."}),$=i||0;return(0,a.jsxs)(a.Fragment,{children:[!!n&&!!n.url&&(0,a.jsx)(b,{style:{maxHeight:`${n&&n.height||t.height}px`,maxWidth:`${n&&n.width||t.width}px`,left:`calc(-60% + ${$}px)`},children:(0,a.jsx)(h,{className:"peek",src:n.url,sizes:"100vw",srcSet:(0,s.gA)(n,!0),"data-image-id":`${n.id}-prev`,alt:n.caption?.plainText||v})}),(0,a.jsx)(p,{style:{maxHeight:`${t.height}px`,maxWidth:`${t.width}px`,left:`calc(50% + ${$}px)`},children:(0,a.jsx)(g,{src:t.url,sizes:"100vw",srcSet:(0,s.gA)(t,!0),"data-image-id":`${t.id}-curr`,alt:t.caption?.plainText||v})}),!!d&&!!d.url&&(0,a.jsx)(_,{style:{maxHeight:`${d&&d.height||t.height}px`,maxWidth:`${d&&d.width||t.width}px`,left:`calc(160% + ${$}px)`},children:(0,a.jsx)(I,{className:"peek",src:d.url,sizes:"100vw",srcSet:(0,s.gA)(d,!0),"data-image-id":`${d.id}-prev`,alt:d.caption?.plainText||v})})]})};I.fragments={image:w};var _=I},2791:function(e,t,i){i.d(t,{Se:function(){return _},ZP:function(){return v}});var a=i(52322),n=i(66898),r=i(97729),o=i.n(r);i(2784);var s=i(98042),l=i(75824),d=i(86958),c=i(49666),m=i(55634),u=i(8531),g=i(83163),p=i(48687),f=i(73183),h=i(54456),b=i(73286),x=i(52154),w=i(71225);let y=e=>{let{pageType:t,subPageType:i,pageConst:n}=e;return(0,a.jsxs)(a.Fragment,{children:[!!t&&(0,a.jsx)("meta",{property:"imdb:pageType",content:t}),!!i&&(0,a.jsx)("meta",{property:"imdb:subPageType",content:i}),!!n&&(0,a.jsx)("meta",{property:"imdb:pageConst",content:n})]})};var I=i(25436);let _=e=>{let t=(0,c.ik)(),i=(0,d.B)().context,{imageUrl:r,imageHeight:_,imageWidth:v}=function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1?arguments[1]:void 0,i=e?w.xJ:w.ax,a=e?w.Yv:w.Bs,n=e?w.Tm:w.yw;return t&&t.url&&t.width&&t.height&&(i=(0,x.y8)(t.url,w.sc),a=t.height/t.width*w.sc,n=w.sc),{imageUrl:i,imageHeight:a,imageWidth:n}}(t,e.image),$=(0,l.N)({id:"common_share_title",defaultMessage:"IMDb: Ratings, Reviews, and Where to Watch the Best Movies & TV Shows"}),T=(0,l.N)({id:"common_share_description",defaultMessage:"IMDb is the world's most popular and authoritative source for movie, TV and celebrity content. Find ratings and reviews for the newest movie and TV shows. Get personalized recommendations, and learn where to watch across hundreds of streaming providers."}),C=(0,p.hg)({weblabID:g.lh.IMDB_NEXT_CLIENT_SIDE_NAVIGATION_323089,treatments:{T1:!0}}),M=e.title??$,j=e.description??T,E=e.openGraphData?.type||f.s.Website,A=i.sidecar?.localizationResponse?.isFullLocalizationEnabled,S=(A?i.sidecar?.localizationResponse?.languageForTranslations??"en_US":"en_US").replace("-","_"),P=function(e){let t=e.pageType,i=e.subPageType;return t===I.PageType.TITLE&&i===I.SubPageType.MAIN||t===I.PageType.NAME&&i===I.SubPageType.MAIN||t===I.PageType.VIDEO&&i===I.SubPageType.VIDEO_PLAYBACK_PAGE}(i),L=M,k=j;if(P){let t=e.openGraphData?.enhancedTitle;t&&t.length>0&&(L=t);let i=e.openGraphData?.enhancedDescription;i&&i.length>0&&(k=i)}let D="";if(e.noIndex||e.noFollow){let t=[];e.noIndex&&t.push("noindex"),e.noFollow&&t.push("nofollow"),e.noIndex&&!e.noFollow&&t.push("follow"),D=t.join(",")}return(0,a.jsxs)(o(),{children:[(0,u.n4)(m.yS.LOAD_META,C),(0,n.logCSAWidgetStart)(m.yS.LOAD_META,Date.now()),(0,a.jsx)("title",{children:M}),(0,a.jsx)("meta",{name:"description",content:j,"data-id":"main"},"page-desc"),!!e.keywords&&(0,a.jsx)("meta",{name:"keywords",content:e.keywords},"page-keywords"),(0,a.jsx)("meta",{name:"google-site-verification",content:"0cadf7898134e79b"}),(0,a.jsx)("meta",{name:"msvalidate.01",content:"C1DACEF2769068C0B0D2687C9E5105FA"}),!!D&&(0,a.jsx)("meta",{name:"robots",content:D}),!e.noIndex&&(0,a.jsx)("meta",{name:"robots",content:"max-image-preview:large"}),!!e.structuredData&&(0,a.jsx)("script",{...(0,s.h6)(e.structuredData)}),!!e.canonicalUrl&&(0,a.jsx)("meta",{property:"og:url",content:e.canonicalUrl},"fb_url"),(0,a.jsx)("meta",{property:"og:site_name",content:t?"IMDbPro":"IMDb"},"fb_site"),(0,a.jsx)("meta",{property:"og:title",content:L},"fb_title"),(0,a.jsx)("meta",{property:"og:description",content:k},"fb_desc"),(0,a.jsx)("meta",{property:"og:type",content:E},"fb_type"),(0,a.jsx)("meta",{property:"og:image",content:r},"fb_img"),(0,a.jsx)("meta",{property:"og:image:height",content:_.toString()},"fb_img_height"),(0,a.jsx)("meta",{property:"og:image:width",content:v.toString()},"fb_img_Width"),(0,a.jsx)("meta",{content:S,property:"og:locale"}),!!A&&!t&&function(e){let t=h.n.map(e=>e.replace("-","_"));return(0,a.jsx)(a.Fragment,{children:t.filter(t=>t!==e).map(e=>(0,a.jsx)("meta",{content:e,property:"og:locale:alternate"},`lc_alt_${e}`))})}(S),(0,a.jsx)("meta",{property:"twitter:site",content:t?"@IMDbPro":"@IMDb"},"tw_site"),(0,a.jsx)("meta",{property:"twitter:title",content:L},"tw_title"),(0,a.jsx)("meta",{property:"twitter:description",content:k},"tw_desc"),(0,a.jsx)("meta",{property:"twitter:card",content:"summary_large_image"},"tw_type"),(0,a.jsx)("meta",{property:"twitter:image",content:r},"tw_img"),(0,a.jsx)("meta",{property:"twitter:image:alt",content:j},"tw_img_alt"),!!e.canonicalUrl&&!e.noIndex&&(0,a.jsx)("link",{rel:"canonical",href:e.canonicalUrl}),(0,b.W)(e.hrefLangEntries),y(i),(0,u.vt)(m.yS.LOAD_META,C),(0,n.logCSAWidgetEnd)(m.yS.LOAD_META,Date.now()),(0,u.wx)(m.yS.LOAD_META,C),(0,n.logCSAWidgetLoad)(m.yS.LOAD_META,Date.now())]})};var v=_},71225:function(e,t,i){i.d(t,{Bs:function(){return r},Tm:function(){return l},Yv:function(){return d},ax:function(){return a},sc:function(){return o},xJ:function(){return s},yw:function(){return n}});let a="https://m.media-amazon.com/images/G/01/imdb/images/social/imdb_logo.png",n=1e3,r=1e3,o=1e3,s="https://m.media-amazon.com/images/S/sash/gje4y522toZQB1l.png",l=300,d=300},73183:function(e,t,i){var a,n;i.d(t,{s:function(){return a}}),(n=a||(a={})).MusicAlbum="music.album",n.MusicSong="music.song",n.Profile="profile",n.VideoEpisode="video.episode",n.VideoMovie="video.movie",n.VideoOther="video.other",n.VideoTvShow="video.tv_show",n.Website="website"},13012:function(e,t,i){i.d(t,{V:function(){return er}});var a=i(52322),n=i(67353),r=i(72779),o=i.n(r);i(2784);var s=i(88169),l=i(75824),d=i(47069);function c(e){let{attributionUrl:t,text:i}=e,a=i||t;return t&&a?`<a href="${t}" target="_blank" rel="noopener nofollow">${a}</a>`:a?`${a}`:void 0}var m=i(10081),u=i(39366);let g={PARENT:"media-sheet",ATTR_BANNER:"media-sheet__attr-banner",COUNT_DISPLAY:"media-sheet__count-display"},p=(0,m.ZP)`
    fragment MediaSheetImageMeta on Image {
        copyright
        createdBy
        caption {
            plaidHtml(queryParams: $queryParams)
        }
        titles {
            id
            titleText {
                text
            }
        }
        source {
            attributionUrl
            text
            banner {
                url
                attributionUrl
            }
        }
        names {
            id
            nameText {
                text
            }
        }
        countries {
            text
        }
        languages {
            text
        }
        # On mobile, we need to refetch correctionLink and reportingLink
        # data with isInIframe: false.
        #
        # This refetching is handled by the ContributeActionButton component.
        correctionLink(
            relatedId: $id
            contributionContext: {
                isInIframe: true
                returnUrl: "${(0,u.Pj)()}"
                business: "consumer"
            }
        ) {
            url
        }
        reportingLink(
            relatedId: $id
            contributionContext: {
                isInIframe: true
                returnUrl: "${(0,u.Pj)()}"
                business: "consumer"
            }
        ) {
            url
        }
    }
`,f=(0,m.ZP)`
    fragment MediaSheetListItemMeta on ListItemNode {
        description {
            originalText {
                plaidHtml(queryParams: $queryParams)
            }
        }
    }
`,h={id:"common_buttons_close",defaultMessage:"Close"},b={id:"common_buttons_open",defaultMessage:"Open"},x={id:"mediaSheet_ariaLabel_edit",defaultMessage:"Edit tags"},w={id:"mediaSheet_ariaLabel_report",defaultMessage:"Report image"},y={id:"mediaSheet_label_name",defaultMessage:"People"},I={id:"mediaSheet_label_title",defaultMessage:"Titles"},_={id:"mediaSheet_label_country",defaultMessage:"Countries"},v={id:"mediaSheet_label_language",defaultMessage:"Languages"},$={id:"mediaSheet_attribution_photoBy",defaultMessage:"Photo by"},T={id:"mediaSheet_attribution_courtesy",defaultMessage:"Image courtesy"};var C=i(26806),M=i(41174),j=i(30634),E=i(11438),A=i(19596),S=i(86704);let P=(0,A.default)(s.IconButton).withConfig({componentId:"sc-e7f4329a-0"})(["","{margin-right:calc(var(--ipt-pageMargin) - 0.75rem);}"],S.mediaQueries.breakpoints.above.l);var L=e=>{let{name:t,label:i,className:n,isButton:r,onSelect:o,href:s}=e,l={name:t,label:i,className:n,onSelect:o,"data-testid":`mv-contrib-${t}`};return(0,a.jsx)(P,{...l,href:r?void 0:s})},k=e=>{let{actionName:t,className:i,flow:n,label:r,query:o}=e,l=(0,C.m8)(),d=(0,M.nu)(),{makeRefMarker:c}=(0,E.Lz)(),u=(0,s.useBreakpointsAsConfig)();if(!n)return null;let g=`${n.desktopLink}&ref_=${c(E.Cd.EDIT)}`,p=u.l||u.xl;return(0,a.jsx)(L,{name:t,label:r,className:i??"",onSelect:e=>{p?d?n.desktopOnOpen():(0,j.rf)(c(E.Cd.SIGN_IN)):(e.preventDefault(),l.query((0,m.ZP)`
                        query ContributeActionButton(
                            $imageId: ID!
                            $relatedId: ID!
                            $returnUrl: URL!
                        ) {
                            image(id: $imageId) {
                                correctionLink(
                                    relatedId: $relatedId
                                    contributionContext: {
                                        isInIframe: false
                                        returnUrl: $returnUrl
                                        business: "consumer"
                                    }
                                ) {
                                    url
                                }
                                reportingLink(
                                    relatedId: $relatedId
                                    contributionContext: {
                                        isInIframe: false
                                        returnUrl: $returnUrl
                                        business: "consumer"
                                    }
                                ) {
                                    url
                                }
                            }
                        }
                    `,{...o,returnUrl:window.location.href}).toPromise().then(e=>{let t=n.resolveMobileURL(e.data.image);window.open(t,"_self")}).catch(e=>{throw e}))},href:g,isButton:p})};let D=A.default.div.withConfig({componentId:"sc-3d8c6ae9-0"})(["position:absolute;bottom:0;width:100%;max-height:calc(53% - 1.5rem);display:flex;z-index:2;","{max-height:calc(50%);}"],S.mediaQueries.devices.onTouchScreens),N=(0,A.default)(s.PageContentContainer).withConfig({componentId:"sc-3d8c6ae9-1"})(["position:relative;display:flex;width:100%;"]),R=A.default.div.withConfig({componentId:"sc-3d8c6ae9-2"})([""," "," background:rgba(",",0.85);background:rgba(",",0.85);border-top:1px solid ",";border-top:1px solid ",";width:100%;display:flex;flex-direction:column;overflow:auto;transition:all 0.5s ease-out ","{height:100%;overflow:hidden;}"],(0,S.setTypographyType)("body"),(0,S.setPropertyToColorVar)("color","ipt-on-baseAlt-color"),(0,S.getColorVarValue)("ipt-baseAlt-shade3-rgb"),(0,S.getColorVar)("ipt-baseAlt-shade3-rgb"),(0,S.getColorVarValue)("ipt-baseAlt-border-color"),(0,S.getColorVar)("ipt-baseAlt-border-color"),S.mediaQueries.breakpoints.above.l),V=A.default.div.withConfig({componentId:"sc-3d8c6ae9-3"})([""," "," display:flex;justify-content:space-between;padding:0.5rem 1rem;padding:0.5rem ",";flex-shrink:0;"],(0,S.setTypographyType)("bodySmall"),(0,S.setPropertyToColorVar)("color","ipt-on-baseAlt-accent1-color"),(0,S.getSpacingVar)("ipt-pageMargin")),B=A.default.span.withConfig({componentId:"sc-3d8c6ae9-4"})(["display:none;","{display:flex;}"],S.mediaQueries.breakpoints.only.m),O=`
    position: relative;
    &::after {
        content: '';
        background: linear-gradient(
            to top,
            ${(0,S.getColorVarValue)("ipt-baseAlt-shade3-color")},
            transparent
        );
        background: linear-gradient(
            to top,
            ${(0,S.getColorVar)("ipt-baseAlt-shade3-color")},
            transparent
        );
        height: 1rem;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
    }
`,U=A.default.div.withConfig({componentId:"sc-3d8c6ae9-5"})(["display:flex;flex-direction:column;","{height:100%;}"],S.mediaQueries.breakpoints.above.l),Y=A.default.div.withConfig({componentId:"sc-3d8c6ae9-6"})(["display:flex;flex-direction:column;overflow:auto;flex-grow:2;","{flex-direction:row;overflow:hidden;","}"],S.mediaQueries.breakpoints.above.l,O),Q=A.default.div.withConfig({componentId:"sc-3d8c6ae9-7"})(["width:100%;text-align:center;padding:0 1rem 0.5rem 1rem;padding:0 "," 0.5rem ",";","{","}"],(0,S.getSpacingVar)("ipt-pageMargin"),(0,S.getSpacingVar)("ipt-pageMargin"),S.mediaQueries.breakpoints.above.l,(0,S.setPropertyToColorVar)("background","ipt-baseAlt-shade3-bg")),F=(0,A.default)(s.HTMLContent).withConfig({componentId:"sc-3d8c6ae9-8"})(["padding:0 1rem 1rem;padding:0 "," 1rem;","{overflow:auto;flex-grow:1;width:60%;padding-right:1rem;height:100%;}"],(0,S.getSpacingVar)("ipt-pageMargin"),S.mediaQueries.breakpoints.above.l),G=A.default.div.withConfig({componentId:"sc-3d8c6ae9-9"})([""," margin:0 1rem;margin:0 ",";min-height:1px;min-width:1px;","{margin:0 0 1rem 0;}"],(0,S.setPropertyToColorVar)("background","ipt-baseAlt-border-color"),(0,S.getSpacingVar)("ipt-pageMargin"),S.mediaQueries.breakpoints.above.l),W=A.default.div.withConfig({componentId:"sc-3d8c6ae9-10"})(["margin:0 1rem;margin:0 ",";padding-top:1rem;","{margin:0;padding:0 0.25rem 1rem 1rem;width:35%;overflow:auto;height:100%;}"],(0,S.getSpacingVar)("ipt-pageMargin"),S.mediaQueries.breakpoints.above.l),z=A.default.div.withConfig({componentId:"sc-3d8c6ae9-11"})(["display:flex;justify-content:center;padding:0.5rem 0;","{margin-top:-0.5rem;justify-content:flex-start;flex-shrink:1;flex-direction:column;padding-top:0;}"],S.mediaQueries.breakpoints.above.l),q=`
    display: none;
    position: absolute;
    right: 4.5rem;
    ${S.mediaQueries.breakpoints.above.l} {
        display: block;
    }
`,H=(0,A.default)(s.IconBorderButton).withConfig({componentId:"sc-3d8c6ae9-12"})([""," top:-1.125rem;z-index:1;transition:opacity 0.5s ease-in;opacity:",";visibility:",";"],q,e=>e.opacity,e=>e.visibility),Z=(0,A.default)(s.IconBorderButton).withConfig({componentId:"sc-3d8c6ae9-13"})([""," bottom:4rem;transition:opacity 0.5s ease-in;opacity:",";visibility:",";"],q,e=>e.opacity,e=>e.visibility),X=A.default.div.withConfig({componentId:"sc-3d8c6ae9-14"})(["margin-bottom:0.25rem;",""],(0,S.setTypographyType)("bodySmall")),K=A.default.span.withConfig({componentId:"sc-3d8c6ae9-15"})(["margin-right:0.5rem;font-weight:500;"]),J=(0,A.default)(s.HTMLContent).withConfig({componentId:"sc-3d8c6ae9-16"})([""," ",""],(0,S.setPropertyToColorVar)("color","ipt-on-baseAlt-textSecondary-color"),(0,S.setTypographyType)("copyright")),ee=A.default.img.withConfig({componentId:"sc-3d8c6ae9-17"})(["max-width:100%;"]);var et=i(66724),ei=i(87801);let ea=e=>{let{array:t,title:i}=e,{nameMainLinkBuilder:n,titleMainLinkBuilder:r}=(0,et.WOb)(),o=[];for(let e=0;e<t.length;e++){let i=t[e];i.nameText?.text&&i.id?o.push((0,a.jsx)(s.TextLink,{href:n({nconst:i.id,refSuffix:ei.C.SEE_MORE}),text:i.nameText.text},`image-name-link-${i.id}`)):i.titleText?.text&&i.id?o.push((0,a.jsx)(s.TextLink,{href:r({tconst:i.id,refSuffix:ei.C.SEE_MORE}),text:i.titleText.text},`image-title-link-${i.id}`)):i.text&&o.push((0,a.jsx)("span",{children:i.text},`item-meta-${i.text}`)),e<t.length-1&&o.push(", ")}return(0,a.jsx)(a.Fragment,{children:o.length>0&&(0,a.jsxs)(X,{children:[(0,a.jsx)(K,{children:i}),(0,a.jsx)("span",{children:o})]})})},en=(e,t)=>{(0,n.isEnterOrSpaceKey)(e)&&t()},er=e=>{let t={closeSheetAriaLabel:(0,l.N)(h),openSheetAriaLabel:(0,l.N)(b),editAriaLabel:(0,l.N)(x),reportAriaLabel:(0,l.N)(w),nameLabel:(0,l.N)(y),titleLabel:(0,l.N)(I),countryLabel:(0,l.N)(_),languageLabel:(0,l.N)(v),photoByAttributionPrefix:(0,l.N)($),courtesyAttributionPrefix:(0,l.N)(T)},{content:i,imageData:n,editFlow:r,reportFlow:m,isClosed:u,onCloseClicked:p,onOpenClicked:f}=e,C=u?0:1,M=u?"hidden":"visible",j=function(e,t){let{copyright:i,createdBy:a,source:n}=e;if(!i&&!a&&!n)return;let r=n&&c(n)?`${t.courtesyText} ${c(n)}`:void 0,o=[a?`${t.photoByText} ${a}`:void 0,i?`&copy;&nbsp;${i}`:void 0,r].filter(e=>!!e);return o.length?o.join(" - "):void 0}(n,{photoByText:t.photoByAttributionPrefix,courtesyText:t.courtesyAttributionPrefix}),E=()=>{n?.source?.text==="gettyimages.com"?(0,d.P)("offsite-gettyimages"):n?.source?.text==="mptvimages.com"&&(0,d.P)("offsite-mptvimages")};return(0,a.jsx)(D,{className:o()(e.className),children:(0,a.jsx)(s.SetPalette,{palette:"dark",children:(0,a.jsxs)(N,{children:[(0,a.jsx)(Z,{name:"info",className:"media-sheet__open",label:t.openSheetAriaLabel,onSelect:f,opacity:u?1:0,visibility:u?"visible":"hidden"}),(0,a.jsx)(H,{label:t.closeSheetAriaLabel,className:"media-sheet__close",name:"clear",onSelect:p,opacity:C,visibility:M}),(0,a.jsx)(R,{"aria-hidden":u,style:{opacity:C,visibility:M},"data-testid":g.PARENT,children:(0,a.jsxs)(U,{children:[(0,a.jsxs)(V,{role:"presentation",children:[(0,a.jsx)("span",{children:i.contextTitle}),(0,a.jsx)(B,{"data-testid":g.COUNT_DISPLAY,children:i.contextCount})]}),(0,a.jsxs)(Y,{children:[(0,a.jsx)(F,{html:n.caption?.plaidHtml||""}),(0,a.jsx)(G,{}),(0,a.jsxs)(W,{children:[!!n.names&&(0,a.jsx)(ea,{array:n.names,title:t.nameLabel}),!!n.titles&&(0,a.jsx)(ea,{array:n.titles,title:t.titleLabel}),!!n.countries&&(0,a.jsx)(ea,{array:n.countries,title:t.countryLabel}),!!n.languages&&(0,a.jsx)(ea,{array:n.languages,title:t.languageLabel}),!!j&&(0,a.jsx)("div",{onClick:E,onKeyDown:e=>{en(e,E)},"data-testid":"copyright",children:(0,a.jsx)(J,{html:j})})]}),(0,a.jsxs)(z,{children:[(0,a.jsx)(k,{flow:r,actionName:"edit",label:t.editAriaLabel,className:"media-sheet__edit",query:{imageId:e.imageData.id,relatedId:e.listId}}),(0,a.jsx)(k,{flow:m,label:t.reportAriaLabel,className:"media-sheet__report",actionName:"flag",query:{imageId:e.imageData.id,relatedId:e.listId}})]})]}),!!n.source?.banner&&(0,a.jsx)(Q,{"data-testid":g.ATTR_BANNER,children:(0,a.jsx)("a",{href:n.source.banner.attributionUrl,rel:"nofollow noopener noreferrer",target:"_blank",children:(0,a.jsx)(ee,{src:n.source.banner.url,height:n.source.banner.height,width:n.source.banner.width})})})]})})]})})})};er.fragments={image:p,listItem:f}},9325:function(e,t,i){i.d(t,{$C:function(){return v},Ek:function(){return w},HP:function(){return b},KL:function(){return _},Qn:function(){return y},gG:function(){return h},k6:function(){return I},kH:function(){return x},s:function(){return p},ve:function(){return f},wO:function(){return $}});var a=i(10081),n=i(12088),r=i(13012),o=i(11438),s=i(85970);let l=(0,a.ZP)`
    fragment MediaViewerMeta on ImageConnection {
        pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
        }
        edges {
            position
            cursor
            node {
                ...MediaViewerImageMeta
                ...MediaSheetImageMeta
            }
        }
    }

    ${n.C.fragments.image}
    ${r.V.fragments.image}
`,d=(0,a.ZP)`
    fragment MediaViewerListMeta on ListConnection {
        pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
        }
        edges {
            position
            cursor
            node {
                item {
                    ...MediaViewerImageMeta
                    ...MediaSheetImageMeta
                }
                ...MediaSheetListItemMeta
            }
        }
    }
    ${n.C.fragments.image}
    ${r.V.fragments.image}
    ${r.V.fragments.listItem}
`,c=(0,a.ZP)`
    query NameImages(
        $id: ID!
        $before: ID
        $after: ID
        $jumpTo: ID
        $first: Int
        $last: Int
        $lastYes: Boolean!
        $firstYes: Boolean!
        $queryParams: String
    ) {
        name(id: $id) {
            nameText {
                text
            }
            meta {
                publicationStatus
            }
            images(first: $first, after: $after, jumpTo: $jumpTo)
                @include(if: $firstYes) {
                total
                ...MediaViewerMeta
            }
            wrapFront: images(last: $last, before: $before)
                @include(if: $lastYes) {
                total
                ...MediaViewerMeta
            }
            wrapBack: images(first: $first) @include(if: $firstYes) {
                total
                ...MediaViewerMeta
            }
        }
    }
    ${l}
`,m=(0,a.ZP)`
    query TitleImages(
        $id: ID!
        $before: ID
        $after: ID
        $jumpTo: ID
        $first: Int
        $last: Int
        $lastYes: Boolean!
        $firstYes: Boolean!
        $queryParams: String
    ) {
        title(id: $id) {
            titleText {
                text
            }
            meta {
                publicationStatus
            }
            releaseYear {
                year
            }
            images(first: $first, after: $after, jumpTo: $jumpTo)
                @include(if: $firstYes) {
                total
                ...MediaViewerMeta
            }
            wrapFront: images(last: $last, before: $before)
                @include(if: $lastYes) {
                total
                ...MediaViewerMeta
            }
            wrapBack: images(first: $first) @include(if: $firstYes) {
                total
                ...MediaViewerMeta
            }
        }
    }
    ${l}
`,u=(0,a.ZP)`
    query GalleryImages(
        $id: ID!
        $before: ID
        $after: ID
        $jumpTo: ID
        $first: Int
        $last: Int
        $lastYes: Boolean!
        $firstYes: Boolean!
        $queryParams: String
    ) {
        imageGallery(id: $id) {
            galleryText
            images(first: $first, after: $after, jumpTo: $jumpTo)
                @include(if: $firstYes) {
                total
                ...MediaViewerMeta
            }
            wrapFront: images(last: $last, before: $before)
                @include(if: $lastYes) {
                total
                ...MediaViewerMeta
            }
            wrapBack: images(first: $first) @include(if: $firstYes) {
                total
                ...MediaViewerMeta
            }
        }
    }
    ${l}
`,g=(0,a.ZP)`
    query ListImages(
        $id: ID!
        $before: ID
        $after: ID
        $jumpTo: ID
        $first: Int
        $last: Int
        $lastYes: Boolean!
        $firstYes: Boolean!
        $queryParams: String
    ) {
        list(id: $id) {
            name {
                originalText
            }
            items(first: $first, after: $after, jumpTo: $jumpTo)
                @include(if: $firstYes) {
                total
                ...MediaViewerListMeta
            }
            wrapFront: items(last: $last, before: $before)
                @include(if: $lastYes) {
                total
                ...MediaViewerListMeta
            }
            wrapBack: items(first: $first) @include(if: $firstYes) {
                total
                ...MediaViewerListMeta
            }
        }
    }
    ${d}
`,p=e=>{switch(e){case s.b.GALLERY:return u;case s.b.LIST:return g;case s.b.NAME:return c;case s.b.TITLE:return m;default:throw Error("Unknown MediaViewerType: "+e)}},f=3,h=6,b=3,x=20,w="vanity",y={title:"title",name:"name",gallery:"imageGallery",list:"list"},I={right:o.Cd.NEXT,left:o.Cd.PREVIOUS},_={countLabel:{id:"mediaViewer_galleryCount_label",defaultMessage:"{position} of {total}"},previousImageLabel:{id:"mediaSheet_ariaLabel_previousImage",defaultMessage:"Previous"},nextImageLabel:{id:"mediaSheet_ariaLabel_nextImage",defaultMessage:"Next"},closePromptLabel:{id:"common_ariaLabel_closePrompt",defaultMessage:"Close Prompt"}},v={PARENT:"media-viewer",ACTION_BAR:"media-viewer__action-bar",ACTION_BAR_GALLERY_COUNT:"action-bar__gallery-count",MEDIA_SHEET:"media-viewer__media-sheet",PAGE_RIGHT:"media-viewer__page-right",PAGE_LEFT:"media-viewer__page-left",LOADER:"media-viewer__loader",IMAGE:"media-viewer__image",TOUCH_HANDLER:"media-viewer__touch-handler",CONTRIBUTE_EDIT_DRAWER:"contribute-edit-drawer",CONTRIBUTE_EDIT_IFRAME:"contribute-edit-iframe",CONTRIBUTE_REPORT_DRAWER:"contribute-report-drawer",CONTRIBUTE_REPORT_IFRAME:"contribute-report-iframe",PAGER_VISIBLE:"ipc-pager--visible"},$="pager-aria-live-region"},49265:function(e,t,i){i.d(t,{Bc:function(){return x},C1:function(){return w},D5:function(){return h},GX:function(){return f},Ov:function(){return p},ed:function(){return u},f$:function(){return m},vI:function(){return y},zL:function(){return b},zb:function(){return c}});var a=i(19596),n=i(88169),r=i(86704),o=i(24062),s=i(9325);let l=()=>`
    top: calc(47% - 4vh);
    transform: translateY(-47%);
`,d=`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
`,c=a.default.div.withConfig({componentId:"sc-1c12727-0"})(["overflow:hidden;position:relative;:focus{outline:0;}.",",.","{display:none;}","{height:calc(100vh - 5rem);.",",.","{display:block;}}height:calc(100vh - 7rem);"],s.$C.CONTRIBUTE_EDIT_DRAWER,s.$C.CONTRIBUTE_REPORT_DRAWER,r.mediaQueries.breakpoints.above.m,s.$C.CONTRIBUTE_EDIT_DRAWER,s.$C.CONTRIBUTE_REPORT_DRAWER),m=(0,a.default)(n.Pager).withConfig({componentId:"sc-1c12727-1"})(["","{left:0.25rem;}","{","}",""],r.mediaQueries.breakpoints.below.xs,r.mediaQueries.breakpoints.above.xs,(0,r.setPropertyToSpacingVar)("left","ipt-pageMargin"),l),u=(0,a.default)(n.Pager).withConfig({componentId:"sc-1c12727-2"})(["","{right:0.25rem;}","{","}",""],r.mediaQueries.breakpoints.below.xs,r.mediaQueries.breakpoints.above.xs,(0,r.setPropertyToSpacingVar)("right","ipt-pageMargin"),l),g=`
    position: absolute;
    top: 0;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
`,p=a.default.div.withConfig({componentId:"sc-1c12727-3"})([""," height:'50px';width:'365px';"],g),f=a.default.div.withConfig({componentId:"sc-1c12727-4"})([""," height:100%;width:100%;","{overflow-x:auto;}"],g,r.mediaQueries.devices.onTouchScreens),h=a.default.div.withConfig({componentId:"sc-1c12727-5"})(["","{position:absolute;height:100%;width:120%;}","{display:none;}"],r.mediaQueries.devices.onTouchScreens,r.mediaQueries.devices.onCursorScreens),b=a.default.div.withConfig({componentId:"sc-1c12727-6"})(["",""],d),x=(0,a.default)(o.F).withConfig({componentId:"sc-1c12727-7"})(["&&{","}"],d),w=a.default.div.withConfig({componentId:"sc-1c12727-8"})(["@keyframes slide-in{0%{left:50%;}100%{left:50%;}}"," height:100%;width:100%;animation:slide-in 1s;left:",";display:flex;align-items:center;justify-content:center;z-index:1;","{z-index:0;}> div{width:100%;height:100%;}#interstitial_responsive_wrapper,#interstitial_wrapper{display:flex;width:100%;height:100%;flex-direction:column;justify-content:center;align-items:center;}#interstitialplaceholderPattern{display:none;}"],d,e=>`calc(50% + ${e.offset}px)`,r.mediaQueries.devices.onTouchScreens),y=a.default.span.withConfig({componentId:"sc-1c12727-9"})([""," vertical-align:middle;","{display:none;}","{margin-right:0.325rem;text-align:right;}"],(0,r.setPropertyToColorVar)("color","ipt-on-baseAlt-accent1-color"),r.mediaQueries.breakpoints.only.m,r.mediaQueries.breakpoints.above.m)},85970:function(e,t,i){var a,n;i.d(t,{b:function(){return a}}),(n=a||(a={})).TITLE="title",n.NAME="name",n.GALLERY="gallery",n.LIST="list"},54456:function(e,t,i){i.d(t,{O:function(){return n},n:function(){return a}});let a=["en-US","es-ES","es-MX","fr-FR","fr-CA","it-IT","pt-BR","hi-IN","de-DE"],n=e=>a.includes(e)},34231:function(e,t,i){i.d(t,{z:function(){return s}});var a=i(5632),n=i(49666),r=i(66093),o=i(1833);let s=e=>{let t=(0,a.useRouter)(),i=(0,n.ik)();if(!e||i)return;let r=t?.asPath?.split("?")[0],s=(0,o.PD)(r),d=l(s),c=`${o.l8}${s}`;return[{language:"x-default",url:c},{language:"en",url:c},...d]},l=e=>Object.values(r.RF).map(t=>({language:t,url:`${o.l8}/${t}${e}`}))}}]);