(this.webpackJsonpreshuffle=this.webpackJsonpreshuffle||[]).push([[0],{107:function(e,t,n){"use strict";(function(e){var n={detectMobile:function(){var e=navigator.userAgent||navigator.vendor||window.opera;return[/Android/i,/webOS/i,/iPhone/i,/iPad/i,/iPod/i,/BlackBerry/i,/Windows Phone/i].some((function(t){return e.match(t)}))},detectIOS:function(){var t=navigator.userAgent||navigator.vendor||window.opera;return e.browser&&/iPad|iPhone|iPod/.test(t)}};t.a=n}).call(this,n(115))},162:function(e,t,n){},163:function(e,t,n){},238:function(e,t,n){"use strict";n.r(t);var o=n(3),i=n(0),a=n.n(i),r=n(15),s=n.n(r),c=(n(162),n(163),n(17)),l=n(91),h=n(313),d=n(143),u=n(314),p=n(315),j=n(32),b=n(33),f=n(35),v=n(34),m=n(298),O=n(144),g=n(316),y=n(289),w=n(297),x=n(293),S=n(294),k=n(292);var C=function(e){var t=a.a.useState(""),n=Object(O.a)(t,2),i=n[0],r=n[1],s=function(){e.onConfirm(i),r("")};return Object(o.jsxs)(y.a,{open:e.open,onClose:e.onCancel,"aria-labelledby":"form-dialog-title",children:[Object(o.jsx)(k.a,{id:"form-dialog-title"}),Object(o.jsxs)(x.a,{children:[Object(o.jsx)(S.a,{children:e.text}),Object(o.jsx)(g.a,{margin:"dense",id:"name",fullWidth:!0,onChange:function(e){r(e.target.value)},onKeyDown:function(e){13===e.keyCode&&(e.preventDefault(),s())},autoFocus:!0})]}),Object(o.jsxs)(w.a,{children:[e.onCancel&&Object(o.jsx)(m.a,{onClick:e.onCancel,variant:"contained",children:"Cancel"}),Object(o.jsx)(m.a,{onClick:s,variant:"contained",children:"Confirm"})]})]})};var D=function(e){return Object(o.jsxs)(y.a,{open:e.open,onClose:e.onClose,children:[Object(o.jsx)(k.a,{id:"text-dialog-title",children:e.title}),Object(o.jsx)(x.a,{children:Object(o.jsx)(S.a,{children:e.children})}),Object(o.jsx)(w.a,{children:Object(o.jsx)(m.a,{onClick:e.onClose,variant:"contained",children:"ok"})})]})},P=n(310),_=n(141),M=n.n(_),W=n(67),T=n(308),E=n(5),R=n(306),A=n(307),F=n(309),I=n(145),N=n(140),B=n.n(N),H=(new URL(window.location.origin),Object({NODE_ENV:"production",PUBLIC_URL:"/reshuffle",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).SERVER_ENDPOINT?Object({NODE_ENV:"production",PUBLIC_URL:"/reshuffle",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).SERVER_ENDPOINT:"wss://reshuffle.herokuapp.com/"),L=B()(H),z=n(301),U=n(303),K=n(305),G=n(299),J=n(302),q=n(304),V=n(300),Y=Object(E.a)((function(e){return{head:{backgroundColor:e.palette.common.black,color:e.palette.common.white},body:{fontSize:14}}}))(G.a),Q=Object(E.a)((function(e){return{root:{"&:nth-of-type(odd)":{backgroundColor:e.palette.action.hover}}}}))(V.a),X=Object(z.a)({table:{minWidth:700}});function Z(e){var t=X();return Object(o.jsx)(J.a,{component:I.a,children:Object(o.jsxs)(U.a,{className:t.table,"aria-label":"customized table",children:[Object(o.jsx)(q.a,{children:Object(o.jsxs)(V.a,{children:[Object(o.jsx)(Y,{children:"Room"}),Object(o.jsx)(Y,{align:"right",children:"Players"}),Object(o.jsx)(Y,{align:"right",children:"Observers"}),Object(o.jsx)(Y,{align:"right"})]})}),Object(o.jsx)(K.a,{children:(0===e.rooms.length?[{}]:e.rooms).map((function(t){return Object(o.jsxs)(Q,{children:[Object(o.jsx)(Y,{component:"th",scope:"row",children:t.name}),Object(o.jsx)(Y,{align:"right",children:t.playerCount}),Object(o.jsx)(Y,{align:"right",children:t.observerCount}),Object(o.jsx)(Y,{align:"right",children:t.name&&Object(o.jsx)(m.a,{variant:"contained",onClick:function(){return e.onJoin(t.name)},children:"Join"})})]},t.name)}))})]})})}var $={position:"absolute",bottom:0,right:0},ee=function(e){Object(f.a)(n,e);var t=Object(v.a)(n);function n(e){var o;return Object(j.a)(this,n),(o=t.call(this,e)).state={rooms:[],joinDialogOpen:!1,infoDialogOpen:!1,connectedToServer:!1},o.updateRoomData=function(e){o.setState({rooms:e.rooms})},o.updateConnectedStatus=function(){o.setState({connectedToServer:L.connected})},o}return Object(b.a)(n,[{key:"componentDidMount",value:function(){this.updateConnectedStatus(),L.on("connect",this.updateConnectedStatus),L.on("disconnect",this.updateConnectedStatus),L.on("othello.rooms.list",this.updateRoomData),L.emit("othello.rooms.request"),this.interval=setInterval((function(){L.emit("othello.rooms.request")}),5e3)}},{key:"componentWillUnmount",value:function(){L.off("connect",this.updateConnectedStatus),L.off("disconnect",this.updateConnectedStatus),L.off("othello.rooms.list",this.updateRoomData),clearInterval(this.interval)}},{key:"render",value:function(){var e=this,t=this.props.classes,n=this.props.history,i=function(e,t,n){return Object(o.jsx)(m.a,{variant:"contained","aria-label":e,onClick:n,disabled:t,children:e},e)},a=function(t){t&&(n.push("/othello/room/"+t),e.state.joinDialogOpen&&e.setState({joinDialogOpen:!1}))};return Object(o.jsxs)("div",{children:[Object(o.jsx)(Z,{onJoin:a,rooms:this.state.rooms}),Object(o.jsxs)("div",{className:t.actionGroup,children:[i("Create Room",!this.state.connectedToServer,this.props.onCreate),i("Find Room",!this.state.connectedToServer,(function(){e.setState({joinDialogOpen:!0})})),i("Practice",!1,(function(){n.push("/othello/practice")}))]}),!this.state.connectedToServer&&Object(o.jsx)("div",{style:{width:"100%",display:"flex",justifyContent:"center",paddingTop:"1vh"},children:Object(o.jsx)(R.a,{style:{maxWidth:350},children:Object(o.jsxs)(I.a,{children:[Object(o.jsx)(A.a,{children:Object(o.jsx)(T.a,{style:{marginTop:"3vh"}})}),Object(o.jsxs)(F.a,{children:[Object(o.jsx)(W.a,{children:"This demo uses a low-cost backend server which starts up on demand."}),Object(o.jsx)(W.a,{children:"If no one else is playing, there'll typically be a 30 second delay before the server is ready."})]})]})})}),Object(o.jsx)(C,{open:this.state.joinDialogOpen,text:"Enter room name",onConfirm:a,onCancel:function(){e.setState({joinDialogOpen:!1})}}),Object(o.jsx)(D,{open:this.state.infoDialogOpen,title:"Attributions",onClose:function(){e.setState({infoDialogOpen:!1})},children:Object(o.jsxs)(W.a,{children:["reshuffle uses sounds from ",Object(o.jsx)(l.b,{to:{pathname:"https://www.zapsplat.com/"},target:"_blank",children:"zapsplat"})]})}),Object(o.jsx)("div",{style:$,children:Object(o.jsx)(P.a,{onClick:function(){e.setState({infoDialogOpen:!0})},children:Object(o.jsx)(M.a,{color:"primary"})})})]})}}]),n}(a.a.Component),te=Object(E.a)((function(e){return{actionGroup:{"& > *":{margin:e.spacing(1)}}}}))(ee),ne=n(22),oe=n(73),ie=n(72),ae={empty:0,black:1,white:2},re=[[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]],se=function(e){if(e!==ae.black&&e!==ae.white)throw Error("Invalid player provided to opponentForPlayer: "+e.toString());return e===ae.black?ae.white:ae.black},ce=function(e,t){return e.length>=1&&0<=t[0]&&t[0]<e.length&&0<=t[1]&&t[1]<e[0].length},le=function(e,t){return[e[0]+t[0],e[1]+t[1]]},he=function(e,t){return[e[0]*t,e[1]*t]},de=function(e,t,n){if(e[n[0]][n[1]]===ae.white||e[n[0]][n[1]]===ae.black)return{};var o,i=se(t),a=Math.max(e.length,e[0].length),r=[],s=Object(ie.a)(re);try{for(s.s();!(o=s.n()).done;){var c=o.value,l=le(n,c);if(ce(e,l)&&e[l[0]][l[1]]===i){for(var h=null,d=2;d<a;++d){var u=le(n,he(c,d));if(ce(e,u)){if(e[u[0]][u[1]]===t){h=d;break}if(e[u[0]][u[1]]===i)continue;break}break}if(h)for(var p=1;p<h;++p){var j=le(n,he(c,p));r.push({position:j,outcome:t})}}}}catch(b){s.e(b)}finally{s.f()}return 0===r.length?[]:(r.push({position:n,outcome:t}),r.sort((function(e,t){return function(e,t){return e[0]!==t[0]?e[0]<t[0]?-1:1:e[1]!==t[1]?e[1]<t[1]?-1:1:0}(e.position,t.position)})),r)},ue=function(e,t,n){return!!ce(e,n)&&(e[n[0]][n[1]]===ae.empty&&de(e,t,n).length>0)},pe={boardsEqual:function(e,t){if(e.length!==t.length||e[0].length!==t[0].length)return!1;for(var n=0,o=Object(ne.a)(Array(e.length).keys());n<o.length;n++)for(var i=o[n],a=0,r=Object(ne.a)(Array(t[0].length).keys());a<r.length;a++){var s=r[a];if(e[i][s]!==t[i][s])return!1}return!0},canPlay:ue,changesForAllPositions:function(e,t){if(0===e.length)return[];for(var n=[],o=0,i=Object(ne.a)(Array(e.length).keys());o<i.length;o++)for(var a=i[o],r=0,s=Object(ne.a)(Array(e[0].length).keys());r<s.length;r++){var c=s[r],l=de(e,t,[a,c]);l.length>0&&n.push({position:[a,c],changeset:l})}return n},changesFromPlay:de,countCellsForRole:function(e,t){for(var n=0,o=0,i=Object(ne.a)(Array(e.length).keys());o<i.length;o++)for(var a=i[o],r=0,s=Object(ne.a)(Array(e[0].length).keys());r<s.length;r++){var c=s[r];e[a][c]===t&&n++}return n},createBoardStateWithMove:function(e,t,n){var o,i=de(e,n,t),a=Object(ne.a)(Array(e.length).keys()).map((function(t){return Array.from(e[t])})),r=Object(ie.a)(i);try{for(r.s();!(o=r.n()).done;){var s=o.value;a[s.position[0]][s.position[1]]=s.outcome}}catch(c){r.e(c)}finally{r.f()}return a},createEmptyBoardState:function(e,t){var n=ae.empty;return Object(ne.a)(Array(e).keys()).map((function(e){return Array(t).fill(n)}))},createInitialBoardState:function(){var e=ae.empty,t=ae.white,n=ae.black;return[[e,e,e,e,e,e,e,e],[e,e,e,e,e,e,e,e],[e,e,e,e,e,e,e,e],[e,e,e,n,t,e,e,e],[e,e,e,t,n,e,e,e],[e,e,e,e,e,e,e,e],[e,e,e,e,e,e,e,e],[e,e,e,e,e,e,e,e]]},isGameCoordinate:ce,labels:ae,opponentForPlayer:se,playerCanPlay:function(e,t){for(var n=0,o=Object(ne.a)(Array(e.length).keys());n<o.length;n++)for(var i=o[n],a=0,r=Object(ne.a)(Array(e[0].length).keys());a<r.length;a++){var s=r[a];if(ue(e,t,[i,s]))return!0}return!1}},je=function(e){Object(f.a)(n,e);var t=Object(v.a)(n);function n(){var e;Object(j.a)(this,n);for(var o=arguments.length,i=new Array(o),a=0;a<o;a++)i[a]=arguments[a];return(e=t.call.apply(t,[this].concat(i))).state={hovered:!1},e}return Object(b.a)(n,[{key:"render",value:function(){var e,t=this,n=function(){t.setState({hovered:!0})},i=function(){t.setState({hovered:!1})},r="#b87340",s=function(e,n){var o=t.props.player===pe.labels.white?"white":"black";return e===pe.labels.white?"white":e===pe.labels.black?"black":n?o:t.props.impossibleColor}(this.props.gameState,this.props.possible),c=(e=this.props.gameState)===pe.labels.white?"white":e===pe.labels.black?"black":r,l=s!==c;return Object(o.jsxs)(a.a.Fragment,{children:[Object(o.jsx)(oe.c,{y:this.props.y,x:this.props.x,width:this.props.width,height:this.props.height,fill:this.props.highlight?"#83ce7a":"#b87340",shadowBlur:5,onClick:this.props.onClick,onTap:this.props.onClick,onDblTap:this.props.onClick,onMouseOver:n,onMouseOut:i}),Object(o.jsx)(oe.a,{y:this.props.y+this.props.height/2,x:this.props.x+this.props.width/2,width:.85*this.props.width,height:.85*this.props.height,shadowBlur:c!==r?1:void 0,fill:this.state.hovered?s:c,opacity:l&&this.state.hovered?.5:void 0,onClick:this.props.onClick,onTap:this.props.onClick,onDblTap:this.props.onClick,onMouseOver:n,onMouseOut:i})]})}}]),n}(a.a.Component),be=function(e){Object(f.a)(n,e);var t=Object(v.a)(n);function n(){return Object(j.a)(this,n),t.apply(this,arguments)}return Object(b.a)(n,[{key:"render",value:function(){var e=this,t=[];this.props.showMovesForPlayer&&(t=pe.changesForAllPositions(this.props.game,this.props.showMovesForPlayer));var n=this.props.width,i=this.props.height,a=function(a,r,s){var c=n/8,l=i/8,h=a*l,d=r*c,u=function(e,n){return e===pe.labels.empty&&t.filter((function(e){return e.position[0]===n[0]&&e.position[1]===n[1]})).length>0}(s,[a,r]),p=e.props.highlightCell&&e.props.highlightCell[0]===a&&e.props.highlightCell[1]===r,j=u?function(t){!function(t,n,o){e.props.onMove&&o&&e.props.onMove({position:[t,n]})}(a,r,!0)}:void 0;return Object(o.jsx)(je,{width:c,height:l,boardPosition:[a,r],player:e.props.showMovesForPlayer,x:d,y:h,gameState:s,possible:u,onClick:j,highlight:p},"othello-cell-"+a.toString()+"-"+r.toString())},r=Object(ne.a)(Array(8).keys()),s=Object(ne.a)(Array(8).keys());return Object(o.jsx)(oe.d,{width:n,height:i,style:this.props.style,children:Object(o.jsx)(oe.b,{children:r.map((function(t){return s.map((function(n){return a(t,n,e.props.game[t][n])}))}))})})}}]),n}(i.Component),fe=n(318),ve=n(106),me=n.n(ve),Oe=Object(z.a)((function(e){return{root:{justifyContent:"center",listStyle:"none"},chip:{margin:e.spacing(.5)}}}));var ge=function(e){var t=Oe(),n=e.role===pe.labels.black,i=pe.labels.black===e.active,a=pe.labels.white===e.active,r=n&&i||!n&&a,s=!n&&i||n&&a;return Object(o.jsxs)("div",{className:t.root,style:{margin:"1vh",display:"flex"},children:[Object(o.jsx)(fe.a,{icon:Object(o.jsx)(me.a,{style:{color:n?"#000000":"#ffffff"}}),label:n?e.blackScore:e.whiteScore,className:t.chip,style:r?void 0:{opacity:"50%"}},"score-1"),Object(o.jsx)(fe.a,{icon:Object(o.jsx)(me.a,{style:{color:n?"#ffffff":"#000000"}}),label:n?e.whiteScore:e.blackScore,className:t.chip,style:s?void 0:{opacity:"50%"}},"score-2")]})},ye=new Audio("/reshuffle/zapsplat_impacts_wood_thin_small_panel_knock_hit_lite_muted_004_39796.mp3"),we=function(e){Object(f.a)(n,e);var t=Object(v.a)(n);function n(e){var o;return Object(j.a)(this,n),(o=t.call(this,e)).state={board:pe.createInitialBoardState(),player:pe.labels.black,windowWidth:null,windowHeight:null},o.updateWindowDimensions=function(){o.setState((function(e,t){return{windowWidth:window.innerWidth,windowHeight:window.innerHeight}}))},o}return Object(b.a)(n,[{key:"componentDidMount",value:function(){this.updateWindowDimensions(),window.addEventListener("resize",this.updateWindowDimensions)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.updateWindowDimensions)}},{key:"render",value:function(){var e=this,t=pe.countCellsForRole(this.state.board,pe.labels.white),n=pe.countCellsForRole(this.state.board,pe.labels.black),i=Math.min(Math.min(.85*this.state.windowWidth,.75*this.state.windowHeight),450);return Object(o.jsxs)("main",{children:[Object(o.jsx)(be,{width:i,height:i,game:this.state.board,showMovesForPlayer:this.state.player,onMove:function(t){if(t.position){var n=pe.createBoardStateWithMove(e.state.board,t.position,e.state.player),o=pe.opponentForPlayer(e.state.player),i=pe.playerCanPlay(n,o)?o:e.state.player;ye.play(),e.setState({board:n,player:i},(function(){ye.play()}))}}}),Object(o.jsx)(ge,{role:pe.labels.black,active:this.state.player,whiteScore:t,blackScore:n}),Object(o.jsx)("div",{style:{padding:"1vh"},children:Object(o.jsx)(m.a,{variant:"contained",onClick:function(){e.setState({board:pe.createInitialBoardState()})},color:"primary",children:" Reset "})})]})}}]),n}(i.Component),xe=n(83),Se=n(296),ke=n(311),Ce=n(312),De=n(31),Pe=n(317),_e=n(295),Me=n(107),We=function(e){Object(f.a)(n,e);var t=Object(v.a)(n);function n(e){var o;return Object(j.a)(this,n),(o=t.call(this,e)).state={currentMessage:"",chatDrawerOpen:!0},o}return Object(b.a)(n,[{key:"render",value:function(){var e=this,t=function(e){var t,n=[],o=Object(ie.a)(e);try{for(o.s();!(t=o.n()).done;){var i=t.value;if(n.length&&i.sender&&n[n.length-1].sender&&n[n.length-1].sender.id===i.sender.id)n[n.length-1].text.push(i.text);else{var a=Object.assign({},i);a.text=[i.text],n.push(a)}}}catch(r){o.e(r)}finally{o.f()}return n}(this.props.messages),n=Object(ne.a)(Array(t.length).keys()).map((function(e){var n=t[e],i=n.text.length;return Object(ne.a)(Array(i).keys()).map((function(t){return Object(o.jsx)(ke.a,{dense:!0,children:Object(o.jsx)(Ce.a,{dense:!0,primary:n.sender?n.sender.name:n.text[t],secondary:n.sender?n.text[t]:void 0})},"message-"+e.toString()+"-"+t.toString())}))})),i=function(t){if(e.state.currentMessage&&e.props.onSend){var n=e.state.currentMessage;e.setState({currentMessage:""},(function(){e.props.onSend(n)}))}t.preventDefault()},a=Object.assign(Object.assign({},{display:"flex",flexDirection:"row",alignItems:"flex-end"}),this.props.style),r=Me.a.detectMobile(),s=r&&Me.a.detectIOS(),c=r?Pe.a:De.a;return Object(o.jsxs)(c,{variant:r?void 0:"permanent",anchor:"right",style:a,className:this.props.className,open:this.state.chatDrawerOpen,onOpen:function(){e.setState({chatDrawerOpen:!0})},onClose:function(){e.setState({chatDrawerOpen:!1})},disableBackdropTransition:!!s||void 0,disableDiscovery:!!s||void 0,children:[Object(o.jsx)(I.a,{style:{overflow:"auto",flexGrow:1,display:"flex",flexDirection:"column-reverse",width:a.width?a.width:"inherit"},children:Object(o.jsx)(Se.a,{"aria-label":"menu",children:n})}),Object(o.jsx)("form",{onSubmit:i,children:Object(o.jsxs)("div",{style:{display:"flex",width:a.width?a.width:"inherit"},children:[Object(o.jsx)(_e.a,{inputProps:{"aria-label":"enter message"},value:this.state.currentMessage,onChange:function(t){e.setState({currentMessage:t.target.value})},style:{flexGrow:1}}),Object(o.jsx)(m.a,{variant:"contained",color:"primary",onClick:i,style:{alignSelf:"flex-end"},children:"Send"})]})})]})}}]),n}(a.a.Component),Te=new Audio("/reshuffle/zapsplat_impacts_wood_thin_small_panel_knock_hit_lite_muted_004_39796.mp3"),Ee=function(e){Object(f.a)(n,e);var t=Object(v.a)(n);function n(e){var o;return Object(j.a)(this,n),(o=t.call(this,e)).state={messages:[],board:null,role:null,activePlayer:null,status:null,joinedRoom:null,windowWidth:0,windowHeight:0,lastMove:null},o.updateWindowDimensions=o.updateWindowDimensions.bind(Object(xe.a)(o)),o}return Object(b.a)(n,[{key:"connectToRoom",value:function(e,t){this.setState({joinedRoom:e},(function(){L.emit("chat.join",e,t),L.emit("othello.join",e)}))}},{key:"updateWindowDimensions",value:function(){this.setState((function(e,t){return{windowWidth:window.innerWidth,windowHeight:window.innerHeight}}))}},{key:"componentDidMount",value:function(){var e=this;this.updateWindowDimensions(),window.addEventListener("resize",this.updateWindowDimensions),L.on("chat.receive",(function(t){e.setState((function(e,n){return{messages:e.messages.concat(t)}}))})),L.on("othello.status",(function(t){e.setState((function(e,n){return{messages:e.messages.concat({isStatus:!0,text:t})}}))})),L.on("othello.update",(function(t){e.setState((function(e,n){var o=!e.board||!e.activePlayer||!e.role||!e.status;return o||t.role!==e.role||t.activePlayer!==e.activePlayer||t.status!==e.status||!pe.boardsEqual(e.board,t.board)?(o||Te.play(),{board:t.board,activePlayer:t.activePlayer,role:t.role,status:t.status,lastMove:t.lastMove}):{}}))}))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.updateWindowDimensions),L.off("chat.receive"),L.off("othello.update")}},{key:"render",value:function(){var e=this,t=this.state.board?pe.countCellsForRole(this.state.board,pe.labels.white):0,n=this.state.board?pe.countCellsForRole(this.state.board,pe.labels.black):0,i="active"===this.state.status,a=this.state.role===this.state.activePlayer?this.state.role:null,r=Object.assign(null===this.state.activePlayer?{opacity:"50%"}:{},{display:"flex",justifyContent:"center"}),s=Math.min(Math.min(.85*this.state.windowWidth,.75*this.state.windowHeight),450);return Object(o.jsxs)("div",{className:this.props.classes.root,children:[Object(o.jsxs)("main",{className:this.props.classes.content,children:[Object(o.jsx)(be,{width:s,height:s,game:null===this.state.board?pe.createEmptyBoardState(8,8):this.state.board,showMovesForPlayer:a,highlightCell:this.state.lastMove?this.state.lastMove.position:void 0,onMove:function(e){e.position&&L.emit("othello.move",e)},style:r}),Object(o.jsx)(ge,{role:this.state.role,active:this.state.activePlayer,whiteScore:t,blackScore:n}),this.state.role?Object(o.jsxs)("div",{style:{padding:"1vh"},children:[Object(o.jsx)(m.a,{variant:"contained",onClick:function(){null!==e.state.role&&L.emit("othello.swap")},disabled:"new"!==this.state.status,color:"primary",children:" Swap "}),Object(o.jsx)(m.a,{variant:"contained",onClick:function(){null!==e.state.role&&L&&L.emit("othello.reset")},disabled:i,color:"primary",children:" Reset "}),Object(o.jsx)(m.a,{variant:"contained",onClick:function(){null!==e.state.role&&L.emit("othello.concede")},disabled:!i,color:"primary",children:" Concede "})]}):this.state.joinedRoom&&Object(o.jsx)(I.a,{style:{padding:"1vh"},children:Object(o.jsx)(W.a,{children:"You are observing."})})]}),Object(o.jsx)(We,{messages:this.state.messages,onSend:function(e){L.emit("chat.send",e)},style:{width:Math.min(300,.75*this.state.windowWidth)}}),Object(o.jsx)(C,{open:null===this.state.joinedRoom,text:"Choose a name",onConfirm:function(t){t&&e.connectToRoom(e.props.roomID,t)}})]})}}]),n}(a.a.Component),Re=Object(E.a)((function(e){return{root:{display:"flex"},content:{flexGrow:1,padding:e.spacing(3)},chatDrawer:{width:300}}}))(Ee);function Ae(){var e=Object(c.f)(),t=Object(h.a)("(prefers-color-scheme: dark)"),n=a.a.useMemo((function(){return Object(d.a)({palette:{type:t?"dark":"light"}})}),[t]);return a.a.useEffect((function(){var t=function(t){e.push("othello/room/"+t)};return L.on("room.created",t),function(){L.off("room.created",t)}})),Object(o.jsxs)(u.a,{theme:n,children:[Object(o.jsx)(p.a,{}),Object(o.jsx)("div",{className:"App",children:Object(o.jsxs)(c.c,{children:[Object(o.jsx)(c.a,{exact:!0,path:"/",component:function(e){return Object(o.jsx)(te,{onCreate:function(){L.emit("chat.create")},match:e.match,history:e.history})}}),Object(o.jsx)(c.a,{exact:!0,path:"/othello/practice",children:Object(o.jsx)(we,{})}),Object(o.jsx)(c.a,{path:"/othello/room/:roomID/",component:function(e){return Object(o.jsx)(Re,{roomID:e.match.params.roomID})}})]})})]})}var Fe=function(){return Object(o.jsx)(l.a,{basename:"/reshuffle",children:Object(o.jsx)(Ae,{})})},Ie=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,319)).then((function(t){var n=t.getCLS,o=t.getFID,i=t.getFCP,a=t.getLCP,r=t.getTTFB;n(e),o(e),i(e),a(e),r(e)}))};s.a.render(Object(o.jsx)(a.a.StrictMode,{children:Object(o.jsx)(Fe,{})}),document.getElementById("root")),Ie()}},[[238,1,2]]]);
//# sourceMappingURL=main.9962b877.chunk.js.map