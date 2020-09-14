$(document).ready(function () {
	//espera a que mi documento este listo para poder empezar a manipularlo con jQuery
	$(
		"#searchBar,#gameInformation,#homeNav, #rules, #aboutUs, #maps, #contact,#letsShare "
	).hide();

	$(".nav-item").on("click", "a", function () {
		//detecta si aprieto alguno de los botones del navegador
		$("#page").fadeOut("slow").html(this.dataset.name).fadeIn("slow");
		//me muestra el nombre de la pagina en el  emcabezado
		$("#titleNav").hide().html(this.dataset.name).fadeIn("slow");
		//data no es una propiedad de "a" la tuve que crear con la propiedad ".dataset" de jquery
		$(
			"#gameInformationNav,#homeNav,#aboutUsNav,#mapsNav,#contactNav,#rulesNav,#letsShareNav"
		).show("slow");
		//me muestra los botones en el navegador de las demas paginas
		$(
			"#home, #rules, #aboutUs, #maps, #contact, #gameInformation,#letsShare"
		).hide("slow");
		//me oculta las demas paginas no seleccionadas
		$("#" + this.id).hide("slow");
		$("#" + this.dataset.page).slideDown();
		if ("letsShareNav" == this.id) {
			app.printPost();
			$("#searchBar").show();
		}
	});
	$("#gameInformationBtn,#backBtn,#mapsBtn").click(function () {
		//lo mismo que la funcion de  arreba pero para los botones que esta dentro de la pagina como hypervinculos
		$("#page").fadeOut("slow").html(this.dataset.name).fadeIn("slow");
		$("#titleNav").hide().html(this.dataset.name).fadeIn("slow"); //data no es una propiedad de "a" la tuve que crear con la propiedad ".dataset" de jquery
		$(
			"#gameInformationNav,#homeNav,#aboutUsNav,#mapsNav,#contactNav,#rulesNav"
		).show("slow");
		$("#home, #rules, #aboutUs, #maps, #contact, #gameInformation").hide(
			"slow"
		);

		$("#" + this.dataset.page).slideDown();
		$("#letsShareNav").click(function () {
			$(".post-card").fadeIn("slow");
		});
	});
	$(function () {
		var navMain = $("#navbarNav"); // avoid dependency on #id
		// "a:not([data-toggle])" - to avoid issues caused
		// when you have dropdown inside navbar
		navMain.on("click", "a:not([data-toggle])", null, function () {
			navMain.collapse("hide");
		});
	});
});

var app = new Vue({
	el: "#app",
	data: {
		input: {
			email: "",
			password: "",
			newPassword1: "",
			newPassword2: "",
			user: null,
			userName: "",
			photoUrl: "",
		},
		notes: {
			newPostMessage: "",
			newPostId: "all",
			oldPost: [],
			showPost: [],
			selectorNotes: "all",
		},
	},
	methods: {
		googleAcces: function () {
			//acceso uruario por google
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase
				.auth()
				.signInWithPopup(provider)
				.catch(function (error) {
					// Handle Errors here.
					var errorCode = error.code;
					if (errorCode === "auth/account-exists-with-different-credential") {
						alert(
							"You have already signed up with a different auth provider for that email."
						);
						// If you are using multiple auth providers on your app you should handle linking
						// the user's accounts here.
					} else {
						console.error(error);
					}
				});
		},
		signOut: function () {
			firebase
				.auth()
				.signOut()
				.then(function () {
					//si salgo de mi usuario voy a borrar todos los datos de mi usuario que guarde en Vue
					console.log("Sign-out successful.");
					app.input.user = null;
					app.input.name = null;
					app.input.email = null;
					app.input.photoUrl = null;
				})
				.catch(function (error) {
					// An error happened.
				});
		},
		onChange(event) {
			//me guarda el valor seleccioando con el menu dropdown de mensajes
			app.notes.newPostId = event.target.value;
		},
		onChange2(event) {
			//me guarda el valor seleccioando con el menu dropdown de filtro de partidos
			app.notes.selectorNotes = event.target.value;
			if (
				app.notes.showPost.id == app.notes.selectorNotes ||
				app.notes.selectorNotes == "all"
			) {
			}
		},
		addPost: function () {
			//me guarda los mensajes con los datos del usuario en el database
			firebase.database().ref("notes").push({
				text: this.notes.newPostMessage,
				id: this.notes.newPostId,
				user: this.input.email,
				url: this.input.photoUrl,
			});
			//necesito que mi cuadro de escritura de mensaje vuelva a estar vacio ahora
			this.notes.newPostMessage = "";
		},
		printPost: function () {
			if (app.notes.showPost == "") {
				//  si la funcion es llamada y mis post estan vacios me va a traer la informaion de mi database
				firebase
					.database()
					.ref("/notes")
					.on("child_added", function (snapshot) {
						var newPost = snapshot.val();
						//ahora todos mis datos estan  en  'newPost'
						app.notes.showPost.push(newPost);
						app.notes.oldPost.push(newPost);
					});
			}
		},
	},
});

var firebaseConfig = {
	apiKey: "AIzaSyCIXAq_a8crlutFiPBz-s_HA3d9F3IfHSU",
	authDomain: "nysl-mindhub-e30c0.firebaseapp.com",
	databaseURL: "https://nysl-mindhub-e30c0.firebaseio.com",
	projectId: "nysl-mindhub-e30c0",
	storageBucket: "nysl-mindhub-e30c0.appspot.com",
	messagingSenderId: "684983603725",
	appId: "1:684983603725:web:1f51f633148b15f55a7b44",
	measurementId: "G-HE1TJBZZFZ",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		var user = firebase.auth().currentUser;
		app.input.user = user.displayName;
		var name, email, photoUrl, uid, emailVerified;
		if (user != null) {
			app.input.name = user.displayName;
			app.input.email = user.email;
			app.input.photoUrl = user.photoURL;
			emailVerified = user.emailVerified;
			uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
			// this value to authenticate with your backend server, if
			// you have one. Use User.getToken() instead.
		}
	} else {
		console.log("No user is signed in.");
	}
});
