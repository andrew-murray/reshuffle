(this.webpackJsonpreshuffle=this.webpackJsonpreshuffle||[]).push([[0],{105:function(e,t,n){"use strict";(function(e){var n={detectMobile:function(){var e=navigator.userAgent||navigator.vendor||window.opera;return[/Android/i,/webOS/i,/iPhone/i,/iPad/i,/iPod/i,/BlackBerry/i,/Windows Phone/i].some((function(t){return e.match(t)}))},detectIOS:function(){var t=navigator.userAgent||navigator.vendor||window.opera;return e.browser&&/iPad|iPhone|iPod/.test(t)}};t.a=n}).call(this,n(115))},162:function(e,t,n){},163:function(e,t,n){},238:function(e,t,n){"use strict";n.r(t);var o=n(3),a=n(0),i=n.n(a),r=n(15),s=n.n(r),c=(n(162),n(32)),l=n(33),h=n(83),u=n(35),d=n(34),p=(n(163),n(17)),j=n(69),b=n(314),f=n(143),m=n(315),O=n(316),v=n(299),g=n(66),y=n(145),x=n(5),w=n(144),k=n(317),S=n(290),C=n(298),D=n(294),P=n(295),T=n(293);var _=function(e){var t=i.a.useState(""),n=Object(w.a)(t,2),a=n[0],r=n[1],s=function(){e.onConfirm(a),r("")};return Object(o.jsxs)(S.a,{open:e.open,onClose:e.onCancel,"aria-labelledby":"form-dialog-title",children:[Object(o.jsx)(T.a,{id:"form-dialog-title"}),Object(o.jsxs)(D.a,{children:[Object(o.jsx)(P.a,{children:e.text}),Object(o.jsx)(k.a,{margin:"dense",id:"name",fullWidth:!0,onChange:function(e){r(e.target.value)},onKeyDown:function(e){13===e.keyCode&&(e.preventDefault(),s())},autoFocus:!0})]}),Object(o.jsxs)(C.a,{children:[Object(o.jsx)(v.a,{onClick:e.onCancel,variant:"contained",children:"Cancel"}),Object(o.jsx)(v.a,{onClick:s,variant:"contained",children:"Confirm"})]})]})};var M=function(e){return Object(o.jsxs)(S.a,{open:e.open,onClose:e.onClose,children:[Object(o.jsx)(T.a,{id:"text-dialog-title",children:e.title}),Object(o.jsx)(D.a,{children:Object(o.jsx)(P.a,{children:e.children})}),Object(o.jsx)(C.a,{children:Object(o.jsx)(v.a,{onClick:e.onClose,variant:"contained",children:"ok"})})]})},E=n(311),A=n(141),R=n.n(A),W=n(309),F=n(307),I=n(308),N=n(310),B=n(140),H=n.n(B),L=(new URL(window.location.origin),Object({NODE_ENV:"production",PUBLIC_URL:"/reshuffle",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).SERVER_ENDPOINT?Object({NODE_ENV:"production",PUBLIC_URL:"/reshuffle",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).SERVER_ENDPOINT:"wss://reshuffle.herokuapp.com/"),U=H()(L),z=n(302),K=n(304),G=n(306),J=n(300),q=n(303),V=n(305),Y=n(301),Q=Object(x.a)((function(e){return{head:{backgroundColor:e.palette.common.black,color:e.palette.common.white},body:{fontSize:14}}}))(J.a),X=Object(x.a)((function(e){return{root:{"&:nth-of-type(odd)":{backgroundColor:e.palette.action.hover}}}}))(Y.a),Z=Object(z.a)({table:{minWidth:700}});function $(e){var t=Z();return Object(o.jsx)(q.a,{component:y.a,children:Object(o.jsxs)(K.a,{className:t.table,"aria-label":"customized table",children:[Object(o.jsx)(V.a,{children:Object(o.jsxs)(Y.a,{children:[Object(o.jsx)(Q,{children:"Room"}),Object(o.jsx)(Q,{align:"right",children:"Players"}),Object(o.jsx)(Q,{align:"right",children:"Observers"}),Object(o.jsx)(Q,{align:"right"})]})}),Object(o.jsx)(G.a,{children:(0==e.rooms.length?[{}]:e.rooms).map((function(t){return Object(o.jsxs)(X,{children:[Object(o.jsx)(Q,{component:"th",scope:"row",children:t.name}),Object(o.jsx)(Q,{align:"right",children:t.playerCount}),Object(o.jsx)(Q,{align:"right",children:t.observerCount}),Object(o.jsx)(Q,{align:"right",children:t.name&&Object(o.jsx)(v.a,{variant:"contained",onClick:function(){return e.onJoin(t.name)},children:"Join"})})]},t.name)}))})]})})}var ee={position:"absolute",bottom:0,right:0},te=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).state={rooms:[],joinDialogOpen:!1,infoDialogOpen:!1,connectedToServer:!1},o.updateRoomData=function(e){o.setState({rooms:e.rooms})},o.updateConnectedStatus=function(){o.setState({connectedToServer:U.connected})},o}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.updateConnectedStatus(),U.on("connect",this.updateConnectedStatus),U.on("disconnect",this.updateConnectedStatus),U.on("othello.rooms.list",this.updateRoomData),U.emit("othello.rooms.request"),this.interval=setInterval((function(){U.emit("othello.rooms.request")}),5e3)}},{key:"componentWillUnmount",value:function(){U.off("connect",this.updateConnectedStatus),U.off("disconnect",this.updateConnectedStatus),U.off("othello.rooms.list",this.updateRoomData),clearInterval(this.interval)}},{key:"render",value:function(){var e=this,t=this.props.classes,n=this.props.history,a=function(e,t){return Object(o.jsx)(v.a,{variant:"contained","aria-label":e,onClick:t,children:e},e)},i=function(t){t&&(n.push("/othello/room/"+t),e.state.joinDialogOpen&&e.setState({joinDialogOpen:!1}))};return Object(o.jsxs)("div",{children:[Object(o.jsx)($,{onJoin:i,rooms:this.state.rooms}),this.state.connectedToServer&&Object(o.jsxs)("div",{className:t.actionGroup,children:[a("Create Room",this.props.onCreate),a("Find Room",(function(){e.setState({joinDialogOpen:!0})})),a("Practice",(function(){n.push("/othello/practice")}))]}),!this.state.connectedToServer&&Object(o.jsx)("div",{style:{width:"100%",display:"flex",justifyContent:"center",paddingTop:"1vh"},children:Object(o.jsx)(F.a,{style:{maxWidth:350},children:Object(o.jsxs)(y.a,{children:[Object(o.jsx)(I.a,{children:Object(o.jsx)(W.a,{style:{marginTop:"3vh"}})}),Object(o.jsxs)(N.a,{children:[Object(o.jsx)(g.a,{children:"This demo uses a low-cost backend server which starts up on demand."}),Object(o.jsx)(g.a,{children:"If no one else is playing, there'll typically be a 30 second delay before the server is ready."})]})]})})}),Object(o.jsx)(_,{open:this.state.joinDialogOpen,text:"Enter room name",onConfirm:i,onCancel:function(){e.setState({joinDialogOpen:!1})}}),Object(o.jsx)(M,{open:this.state.infoDialogOpen,title:"Attributions",onClose:function(){e.setState({infoDialogOpen:!1})},children:Object(o.jsxs)(g.a,{children:["reshuffle uses sounds from ",Object(o.jsx)(j.b,{to:{pathname:"https://www.zapsplat.com/"},target:"_blank",children:"zapsplat"})]})}),Object(o.jsx)("div",{style:ee,children:Object(o.jsx)(E.a,{onClick:function(){e.setState({infoDialogOpen:!0})},children:Object(o.jsx)(R.a,{color:"primary"})})})]})}}]),n}(i.a.Component),ne=Object(x.a)((function(e){return{actionGroup:{"& > *":{margin:e.spacing(1)}}}}))(te),oe=n(23),ae=n(297),ie=n(312),re=n(313),se=n(31),ce=n(318),le=n(296),he=n(105),ue=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).state={currentMessage:"",chatDrawerOpen:!0},o}return Object(l.a)(n,[{key:"render",value:function(){var e=this,t=Object(oe.a)(Array(this.props.messages.length).keys()).map((function(t){return Object(o.jsx)(ie.a,{children:Object(o.jsx)(re.a,{primary:e.props.messages[t]})},"message-"+t.toString())})),n=function(t){if(e.state.currentMessage&&e.props.onSend){var n=e.state.currentMessage;e.setState({currentMessage:""},(function(){e.props.onSend(n)}))}t.preventDefault()},a=Object.assign(Object.assign({},{display:"flex",flexDirection:"row",alignItems:"flex-end"}),this.props.style),i=he.a.detectMobile(),r=i&&he.a.detectIOS(),s=i?ce.a:se.a;return Object(o.jsxs)(s,{variant:i?void 0:"permanent",anchor:"right",style:a,className:this.props.className,open:this.state.chatDrawerOpen,onOpen:function(){e.setState({chatDrawerOpen:!0})},onClose:function(){e.setState({chatDrawerOpen:!1})},disableBackdropTransition:!!r||void 0,disableDiscovery:!!r||void 0,children:[Object(o.jsx)(y.a,{style:{overflow:"auto",flexGrow:1,display:"flex",flexDirection:"column-reverse",width:a.width?a.width:"inherit"},children:Object(o.jsx)(ae.a,{"aria-label":"menu",children:t})}),Object(o.jsx)("form",{onSubmit:n,children:Object(o.jsxs)("div",{style:{display:"flex",width:a.width?a.width:"inherit"},children:[Object(o.jsx)(le.a,{inputProps:{"aria-label":"enter message"},value:this.state.currentMessage,onChange:function(t){e.setState({currentMessage:t.target.value})},style:{flexGrow:1}}),Object(o.jsx)(v.a,{variant:"contained",color:"primary",onClick:n,style:{alignSelf:"flex-end"},children:"Send"})]})})]})}}]),n}(i.a.Component),de=n(73),pe=n(106),je={empty:0,black:1,white:2},be=[[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]],fe=function(e){if(e!==je.black&&e!==je.white)throw Error("Invalid player provided to opponentForPlayer: "+e.toString());return e===je.black?je.white:je.black},me=function(e,t){return e.length>=1&&0<=t[0]&&t[0]<e.length&&0<=t[1]&&t[1]<e[0].length},Oe=function(e,t){return[e[0]+t[0],e[1]+t[1]]},ve=function(e,t){return[e[0]*t,e[1]*t]},ge=function(e,t,n){if(e[n[0]][n[1]]===je.white||e[n[0]][n[1]]===je.black)return{};var o,a=fe(t),i=Math.max(e.length,e[0].length),r=[],s=Object(pe.a)(be);try{for(s.s();!(o=s.n()).done;){var c=o.value,l=Oe(n,c);if(me(e,l)&&e[l[0]][l[1]]===a){for(var h=null,u=2;u<i;++u){var d=Oe(n,ve(c,u));if(me(e,d)){if(e[d[0]][d[1]]===t){h=u;break}if(e[d[0]][d[1]]===a)continue;break}break}if(h)for(var p=1;p<h;++p){var j=Oe(n,ve(c,p));r.push({position:j,outcome:t})}}}}catch(b){s.e(b)}finally{s.f()}return 0===r.length?[]:(r.push({position:n,outcome:t}),r.sort((function(e,t){return function(e,t){return e[0]!==t[0]?e[0]<t[0]?-1:1:e[1]!==t[1]?e[1]<t[1]?-1:1:0}(e.position,t.position)})),r)},ye=function(e,t,n){return!!me(e,n)&&(e[n[0]][n[1]]===je.empty&&ge(e,t,n).length>0)},xe={boardsEqual:function(e,t){if(e.length!==t.length||e[0].length!==t[0].length)return!1;for(var n=0,o=Object(oe.a)(Array(e.length).keys());n<o.length;n++)for(var a=o[n],i=0,r=Object(oe.a)(Array(t[0].length).keys());i<r.length;i++){var s=r[i];if(e[a][s]!==t[a][s])return!1}return!0},canPlay:ye,changesForAllPositions:function(e,t){if(0===e.length)return[];for(var n=[],o=0,a=Object(oe.a)(Array(e.length).keys());o<a.length;o++)for(var i=a[o],r=0,s=Object(oe.a)(Array(e[0].length).keys());r<s.length;r++){var c=s[r],l=ge(e,t,[i,c]);l.length>0&&n.push({position:[i,c],changeset:l})}return n},changesFromPlay:ge,countCellsForRole:function(e,t){for(var n=0,o=0,a=Object(oe.a)(Array(e.length).keys());o<a.length;o++)for(var i=a[o],r=0,s=Object(oe.a)(Array(e[0].length).keys());r<s.length;r++){var c=s[r];e[i][c]===t&&n++}return n},createBoardStateWithMove:function(e,t,n){var o,a=ge(e,n,t),i=Object(oe.a)(Array(e.length).keys()).map((function(t){return Array.from(e[t])})),r=Object(pe.a)(a);try{for(r.s();!(o=r.n()).done;){var s=o.value;i[s.position[0]][s.position[1]]=s.outcome}}catch(c){r.e(c)}finally{r.f()}return i},createEmptyBoardState:function(e,t){var n=je.empty;return Object(oe.a)(Array(e).keys()).map((function(e){return Array(t).fill(n)}))},createInitialBoardState:function(){var e=je.empty,t=je.white,n=je.black;return[[e,e,e,e,e,e,e,e],[e,e,e,e,e,e,e,e],[e,e,e,e,e,e,e,e],[e,e,e,n,t,e,e,e],[e,e,e,t,n,e,e,e],[e,e,e,e,e,e,e,e],[e,e,e,e,e,e,e,e],[e,e,e,e,e,e,e,e]]},isGameCoordinate:me,labels:je,opponentForPlayer:fe,playerCanPlay:function(e,t){for(var n=0,o=Object(oe.a)(Array(e.length).keys());n<o.length;n++)for(var a=o[n],i=0,r=Object(oe.a)(Array(e[0].length).keys());i<r.length;i++){var s=r[i];if(ye(e,t,[a,s]))return!0}return!1}},we=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;Object(c.a)(this,n);for(var o=arguments.length,a=new Array(o),i=0;i<o;i++)a[i]=arguments[i];return(e=t.call.apply(t,[this].concat(a))).state={hovered:!1},e}return Object(l.a)(n,[{key:"render",value:function(){var e,t=this,n=function(){t.setState({hovered:!0})},a=function(){t.setState({hovered:!1})},r=function(e,n){var o=t.props.player===xe.labels.white?"white":"black";return e===xe.labels.white?"white":e===xe.labels.black?"black":n?o:t.props.impossibleColor}(this.props.gameState,this.props.possible),s=(e=this.props.gameState)===xe.labels.white?"white":e===xe.labels.black?"black":"#b87340",c=r!==s;return Object(o.jsxs)(i.a.Fragment,{children:[Object(o.jsx)(de.c,{y:this.props.y,x:this.props.x,width:this.props.width,height:this.props.height,fill:"#b87340",shadowBlur:5,onClick:this.props.onClick,onTap:this.props.onClick,onDblTap:this.props.onClick,onMouseOver:n,onMouseOut:a}),Object(o.jsx)(de.a,{y:this.props.y+this.props.height/2,x:this.props.x+this.props.width/2,width:.85*this.props.width,height:.85*this.props.height,fill:this.state.hovered?r:s,opacity:c&&this.state.hovered?.5:void 0,onClick:this.props.onClick,onTap:this.props.onClick,onDblTap:this.props.onClick,onMouseOver:n,onMouseOut:a})]})}}]),n}(i.a.Component),ke=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var e=this,t=[];this.props.showMovesForPlayer&&(t=xe.changesForAllPositions(this.props.game,this.props.showMovesForPlayer));var n=this.props.width,a=this.props.height,i=function(i,r,s){var c=n/8,l=a/8,h=i*l,u=r*c,d=function(e,n){return e===xe.labels.empty&&t.filter((function(e){return e.position[0]===n[0]&&e.position[1]===n[1]})).length>0}(s,[i,r]),p=d?function(t){!function(t,n,o){e.props.onMove&&o&&e.props.onMove({position:[t,n]})}(i,r,!0)}:void 0;return Object(o.jsx)(we,{width:c,height:l,boardPosition:[i,r],player:e.props.showMovesForPlayer,x:u,y:h,gameState:s,possible:d,onClick:p},"othello-cell-"+i.toString()+"-"+r.toString())},r=Object(oe.a)(Array(8).keys()),s=Object(oe.a)(Array(8).keys());return Object(o.jsx)(de.d,{width:n,height:a,style:this.props.style,children:Object(o.jsx)(de.b,{children:r.map((function(t){return s.map((function(n){return i(t,n,e.props.game[t][n])}))}))})})}}]),n}(a.Component),Se=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;Object(c.a)(this,n);for(var o=arguments.length,a=new Array(o),i=0;i<o;i++)a[i]=arguments[i];return(e=t.call.apply(t,[this].concat(a))).state={game:xe.createInitialBoardState(),player:xe.labels.black},e}return Object(l.a)(n,[{key:"render",value:function(){var e=this;return Object(o.jsx)(ke,{width:400,height:400,game:this.state.game,showMovesForPlayer:this.state.player,onMove:function(t){if(t.position){var n=xe.createBoardStateWithMove(e.state.game,t.position,e.state.player),o=xe.opponentForPlayer(e.state.player),a=xe.playerCanPlay(n,o)?o:e.state.player;e.setState({game:n,player:a})}}})}}]),n}(a.Component),Ce=n(319),De=n(107),Pe=n.n(De),Te=Object(z.a)((function(e){return{root:{display:"flex",justifyContent:"center",flexWrap:"wrap",listStyle:"none",padding:e.spacing(.5),margin:0},chip:{margin:e.spacing(.5)}}}));var _e=function(e){var t=Te(),n=e.role===xe.labels.black,a=xe.labels.black===e.active,i=xe.labels.white===e.active,r=n&&a||!n&&i,s=!n&&a||n&&i;return Object(o.jsxs)("div",{className:t.root,style:{margin:"1vh"},children:[Object(o.jsx)(Ce.a,{icon:Object(o.jsx)(Pe.a,{style:{color:n?"#000000":"#ffffff"}}),label:n?e.blackScore:e.whiteScore,className:t.chip,style:r?void 0:{opacity:"50%"}},"score-1"),Object(o.jsx)(Ce.a,{icon:Object(o.jsx)(Pe.a,{style:{color:n?"#ffffff":"#000000"}}),label:n?e.whiteScore:e.blackScore,className:t.chip,style:s?void 0:{opacity:"50%"}},"score-2")]})},Me=new Audio("/reshuffle/zapsplat_impacts_wood_thin_small_panel_knock_hit_lite_muted_004_39796.mp3"),Ee=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).state={messages:[],board:null,role:null,activePlayer:null,status:null,joinedRoom:null,windowWidth:0,windowHeight:0},o.updateWindowDimensions=o.updateWindowDimensions.bind(Object(h.a)(o)),o}return Object(l.a)(n,[{key:"connectToRoom",value:function(e){this.state.joinedRoom!==e&&this.setState({joinedRoom:e},(function(){U.emit("chat.join",e),U.emit("othello.join",e)}))}},{key:"updateWindowDimensions",value:function(){this.setState((function(e,t){return{windowWidth:window.innerWidth,windowHeight:window.innerHeight}}))}},{key:"componentDidMount",value:function(){var e=this;this.connectToRoom(this.props.roomID),this.updateWindowDimensions(),window.addEventListener("resize",this.updateWindowDimensions),U.on("chat.message",(function(t){e.setState((function(e,n){return{messages:e.messages.concat(t)}}))})),U.on("othello.update",(function(t){e.setState((function(e,n){var o=!e.board||!e.activePlayer||!e.role||!e.status;return o||t.role!==e.role||t.activePlayer!==e.activePlayer||t.status!==e.status||!xe.boardsEqual(e.board,t.board)?(o||Me.play(),{board:t.board,activePlayer:t.activePlayer,role:t.role,status:t.status}):{}}))}))}},{key:"componentDidUpdate",value:function(){this.connectToRoom(this.props.roomID)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.updateWindowDimensions),U.off("chat.message"),U.off("othello.update")}},{key:"render",value:function(){var e=this,t=this.state.board?xe.countCellsForRole(this.state.board,xe.labels.white):0,n=this.state.board?xe.countCellsForRole(this.state.board,xe.labels.black):0,a="active"===this.state.status,i=this.state.role===this.state.activePlayer?this.state.role:null,r=null===this.state.activePlayer?{opacity:"50%"}:void 0,s=Math.min(Math.min(.85*this.state.windowWidth,.75*this.state.windowHeight),450);return Object(o.jsxs)("div",{className:this.props.classes.root,children:[Object(o.jsxs)("main",{className:this.props.classes.content,children:[Object(o.jsx)(ke,{width:s,height:s,game:null===this.state.board?xe.createEmptyBoardState(8,8):this.state.board,showMovesForPlayer:i,onMove:function(e){e.position&&U.emit("othello.move",e)},style:r}),Object(o.jsx)(_e,{role:this.state.role,active:this.state.activePlayer,whiteScore:t,blackScore:n}),this.state.role?Object(o.jsxs)("div",{style:{padding:"1vh"},children:[Object(o.jsx)(v.a,{variant:"contained",onClick:function(){null!==e.state.role&&U.emit("othello.swap")},disabled:a,color:"primary",children:" Swap "}),Object(o.jsx)(v.a,{variant:"contained",onClick:function(){null!==e.state.role&&U&&U.emit("othello.reset")},disabled:a,color:"primary",children:" Reset "}),Object(o.jsx)(v.a,{variant:"contained",onClick:function(){null!==e.state.role&&U.emit("othello.concede")},disabled:!a,color:"primary",children:" Concede "})]}):Object(o.jsx)(y.a,{style:{padding:"1vh"},children:Object(o.jsx)(g.a,{children:"You are observing."})})]}),Object(o.jsx)(ue,{messages:this.state.messages,onSend:function(e){U.emit("chat.message",e)},style:{width:Math.min(300,.75*this.state.windowWidth)}})]})}}]),n}(i.a.Component),Ae=Object(x.a)((function(e){return{root:{display:"flex"},content:{flexGrow:1,padding:e.spacing(3)},chatDrawer:{width:300}}}))(Ee);function Re(){var e=Object(p.f)(),t=Object(b.a)("(prefers-color-scheme: dark)"),n=i.a.useMemo((function(){return Object(f.a)({palette:{type:t?"dark":"light"}})}),[t]);return i.a.useEffect((function(){var t=function(t){e.push("othello/room/"+t)};return U.on("room.created",t),function(){U.off("room.created",t)}})),Object(o.jsxs)(m.a,{theme:n,children:[Object(o.jsx)(O.a,{}),Object(o.jsx)("div",{className:"App",children:Object(o.jsxs)(p.c,{children:[Object(o.jsx)(p.a,{exact:!0,path:"/",component:function(e){return Object(o.jsx)(ne,{onCreate:function(){U.emit("chat.create")},match:e.match,history:e.history})}}),Object(o.jsx)(p.a,{exact:!0,path:"/othello/practice",children:Object(o.jsx)(Se,{})}),Object(o.jsx)(p.a,{path:"/othello/room/:roomID/",component:function(e){return Object(o.jsx)(Ae,{roomID:e.match.params.roomID})}})]})})]})}var We=function(){return Object(o.jsx)(j.a,{basename:"/reshuffle",children:Object(o.jsx)(Re,{})})},Fe=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,320)).then((function(t){var n=t.getCLS,o=t.getFID,a=t.getFCP,i=t.getLCP,r=t.getTTFB;n(e),o(e),a(e),i(e),r(e)}))};s.a.render(Object(o.jsx)(i.a.StrictMode,{children:Object(o.jsx)(We,{})}),document.getElementById("root")),Fe()}},[[238,1,2]]]);
//# sourceMappingURL=main.961a511a.chunk.js.map