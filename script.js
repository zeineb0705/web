// script.js - Code JavaScript complet corrigé

// Images de fond pour rotation
const backgroundImages = [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
];

let currentImageIndex = 0;

// Devise par défaut (Dinar Tunisien)
const DEFAULT_CURRENCY = "د.ت";

// Données initiales des activités
const initialBusinesses = [
    { name: "Crochet", icon: "fas fa-yarn" },
    { name: "Accessoires", icon: "fas fa-rings" },
    { name: "Vêtements", icon: "fas fa-tshirt" },
    { name: "Bijoux", icon: "fas fa-gem" },
    { name: "Décoration", icon: "fas fa-home" },
    { name: "Artisanat", icon: "fas fa-paint-brush" }
];

// Données de produits (stockage local)
let productsData = JSON.parse(localStorage.getItem('esenProducts')) || {};

// Données utilisateur
let currentUser = JSON.parse(localStorage.getItem('esenCurrentUser')) || null;
let currentActivity = null;

// DOM Elements
const businessButtonsContainer = document.getElementById('businessButtons');
const addBtn = document.getElementById('addBtn');
const newBusinessInput = document.getElementById('newBusiness');
const productsSection = document.getElementById('productsSection');
const selectedActivityElement = document.getElementById('selectedActivity');
const productsList = document.getElementById('productsList');
const emptyProducts = document.getElementById('emptyProducts');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const addProductBtn = document.getElementById('addProductBtn');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModalBtn = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const userInfo = document.getElementById('userInfo');

// Fonction pour changer l'image de fond
function changeBackground() {
    const body = document.body;
    body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${backgroundImages[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
}

// Initialiser les boutons d'activité
function initializeBusinessButtons() {
    businessButtonsContainer.innerHTML = '';
    
    initialBusinesses.forEach(business => {
        createBusinessButton(business.name, business.icon);
    });
    
    // Ajouter les activités personnalisées depuis le localStorage
    const customBusinesses = JSON.parse(localStorage.getItem('esenCustomBusinesses')) || [];
    customBusinesses.forEach(business => {
        createBusinessButton(business.name, business.icon || 'fas fa-store');
    });
}

// Créer un bouton d'activité
function createBusinessButton(name, icon) {
    const button = document.createElement('button');
    button.className = 'business-btn';
    button.innerHTML = `
        <i class="${icon}"></i>
        <span>${name}</span>
    `;
    
    button.addEventListener('click', () => {
        selectBusiness(name);
    });
    
    businessButtonsContainer.appendChild(button);
}

// Sélectionner une activité
function selectBusiness(businessName) {
    currentActivity = businessName;
    selectedActivityElement.textContent = businessName;
    
    // Afficher la section produits
    productsSection.classList.add('active');
    
    // Afficher les produits de cette activité
    displayProducts(businessName);
    
    // Faire défiler vers la section produits
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Ajouter une nouvelle activité
addBtn.addEventListener('click', () => {
    const businessName = newBusinessInput.value.trim();
    
    if (businessName !== '') {
        // Vérifier si l'utilisateur est connecté
        if (!currentUser) {
            alert('Veuillez vous connecter pour ajouter une activité');
            loginModal.classList.add('active');
            return;
        }
        
        // Ajouter l'activité
        createBusinessButton(businessName, 'fas fa-plus-circle');
        
        // Sauvegarder dans le localStorage
        const customBusinesses = JSON.parse(localStorage.getItem('esenCustomBusinesses')) || [];
        customBusinesses.push({ name: businessName, icon: 'fas fa-plus-circle' });
        localStorage.setItem('esenCustomBusinesses', JSON.stringify(customBusinesses));
        
        // Réinitialiser le champ
        newBusinessInput.value = '';
        
        // Sélectionner automatiquement cette activité
        selectBusiness(businessName);
    }
});

// Fonction pour obtenir l'image par défaut selon l'activité
function getDefaultImageForActivity(activity) {
    const defaultImages = {
        'Crochet': 'https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Accessoires': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Vêtements': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Bijoux': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Décoration': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Artisanat': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };
    
    return defaultImages[activity] || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
}

// Fonction simplifiée pour créer une modal d'ajout d'image AVEC UPLOAD
function createImageModal() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'photo-modal-overlay';
        modal.innerHTML = `
            <div class="photo-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-camera"></i> Ajouter une image du produit</h3>
                    <button class="close-photo-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="photo-options">
                        <div class="photo-option" id="uploadOption">
                            <i class="fas fa-upload"></i>
                            <span>Téléverser une image</span>
                            <input type="file" id="imageUpload" accept="image/*" style="display: none;">
                        </div>
                        <div class="photo-option" id="urlOption">
                            <i class="fas fa-link"></i>
                            <span>Entrer l'URL d'une image</span>
                        </div>
                    </div>
                    <div class="url-input-container" id="urlInputContainer" style="display: none;">
                        <input type="text" id="photoUrl" placeholder="https://example.com/image.jpg">
                        <button id="confirmUrl">Valider l'URL</button>
                    </div>
                    <div class="image-preview" id="imagePreview" style="display: none;">
                        <img id="previewImage" src="" alt="Aperçu de l'image">
                        <button id="confirmPhoto">Utiliser cette image</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        let selectedImage = null;
        
        // Option Upload d'image
        document.getElementById('uploadOption').addEventListener('click', () => {
            document.getElementById('imageUpload').click();
        });
        
        // Gérer l'upload d'image
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Vérifier si c'est une image
                if (!file.type.startsWith('image/')) {
                    alert('Veuillez sélectionner un fichier image (JPEG, PNG, etc.)');
                    return;
                }
                
                // Vérifier la taille (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('L\'image est trop grande. Taille maximum: 5MB');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    selectedImage = e.target.result; // C'est une URL base64
                    document.getElementById('previewImage').src = selectedImage;
                    document.getElementById('imagePreview').style.display = 'block';
                    document.getElementById('urlInputContainer').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Option URL
        document.getElementById('urlOption').addEventListener('click', () => {
            document.getElementById('urlInputContainer').style.display = 'flex';
            document.getElementById('imagePreview').style.display = 'none';
        });
        
        // Confirmer l'URL
        document.getElementById('confirmUrl').addEventListener('click', () => {
            const url = document.getElementById('photoUrl').value.trim();
            if (url) {
                selectedImage = url;
                document.getElementById('previewImage').src = url;
                document.getElementById('imagePreview').style.display = 'block';
            } else {
                alert('Veuillez entrer une URL valide');
            }
        });
        
        // Confirmer la photo
        document.getElementById('confirmPhoto').addEventListener('click', () => {
            if (selectedImage) {
                resolve(selectedImage);
                document.body.removeChild(modal);
            } else {
                // Si aucune image n'est sélectionnée, utiliser l'image par défaut
                resolve(getDefaultImageForActivity(currentActivity));
                document.body.removeChild(modal);
            }
        });
        
        // Fermer la modal
        document.querySelector('.close-photo-modal').addEventListener('click', () => {
            // Quand on ferme sans choisir, utiliser l'image par défaut
            resolve(getDefaultImageForActivity(currentActivity));
            document.body.removeChild(modal);
        });
        
        // Fermer en cliquant en dehors
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                resolve(getDefaultImageForActivity(currentActivity));
                document.body.removeChild(modal);
            }
        });
    });
}

// Ajouter un produit AVEC IMAGE - VERSION CORRIGÉE
addProductBtn.addEventListener('click', async () => {
    if (!currentActivity) {
        alert('Veuillez sélectionner une activité d\'abord');
        return;
    }
    
    if (!currentUser) {
        alert('Veuillez vous connecter pour ajouter des produits');
        loginModal.classList.add('active');
        return;
    }
    
    const name = productNameInput.value.trim();
    const price = productPriceInput.value.trim();
    
    if (name === '' || price === '') {
        alert('Veuillez remplir le nom et le prix du produit');
        return;
    }
    
    // Validation du prix
    const priceValue = parseFloat(price.replace(',', '.'));
    if (isNaN(priceValue) || priceValue <= 0) {
        alert('Veuillez entrer un prix valide (ex: 5.300 pour 5,300 DT)');
        return;
    }
    
    // Ouvrir la modal pour ajouter une image
    const imageUrl = await createImageModal();
    
    // Créer l'objet produit AVEC IMAGE
    const product = {
        id: Date.now(),
        name: name,
        price: priceValue.toFixed(3) + ' ' + DEFAULT_CURRENCY,
        image: imageUrl,
        activity: currentActivity,
        addedBy: currentUser.email,
        date: new Date().toLocaleDateString('fr-FR'),
        timestamp: Date.now()
    };
    
    // Initialiser le tableau pour cette activité si nécessaire
    if (!productsData[currentActivity]) {
        productsData[currentActivity] = [];
    }
    
    // Ajouter le produit
    productsData[currentActivity].push(product);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('esenProducts', JSON.stringify(productsData));
    
    // Réinitialiser les champs
    productNameInput.value = '';
    productPriceInput.value = '';
    
    // Mettre à jour l'affichage
    displayProducts(currentActivity);
    
    // Confirmation
    alert(`✅ Produit "${name}" ajouté avec succès!\n\n💰 Prix: ${priceValue.toFixed(3)} ${DEFAULT_CURRENCY}`);
});

// Afficher les produits d'une activité AVEC IMAGES
function displayProducts(businessName) {
    productsList.innerHTML = '';
    
    // Créer le conteneur pour les produits
    const productsContainer = document.createElement('div');
    productsContainer.className = 'products-grid';
    
    // Vérifier s'il y a des produits
    const products = productsData[businessName] || [];
    
    if (products.length === 0) {
        productsList.appendChild(emptyProducts.cloneNode(true));
        return;
    }
    
    // Trier les produits par date (plus récent d'abord)
    const sortedProducts = products.sort((a, b) => b.timestamp - a.timestamp);
    
    // Afficher chaque produit avec image
    sortedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'">
                <div class="product-price-badge">${product.price}</div>
            </div>
            <div class="product-content">
                <h4>${product.name}</h4>
                <div class="product-meta">
                    <span class="product-date">Ajouté le ${product.date}</span>
                    <span class="product-activity">${product.activity}</span>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter les événements
        const editBtn = productElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editProduct(product.id);
        });
        
        const deleteBtn = productElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteProduct(product.id);
        });
        
        // Clic sur la carte pour voir les détails
        productElement.addEventListener('click', () => {
            viewProductDetails(product);
        });
        
        productsContainer.appendChild(productElement);
    });
    
    productsList.appendChild(productsContainer);
}

// Voir les détails d'un produit
function viewProductDetails(product) {
    const modal = document.createElement('div');
    modal.className = 'product-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="product-details">
                <div class="details-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="details-content">
                    <h3>${product.name}</h3>
                    <div class="details-price">${product.price}</div>
                    <div class="details-meta">
                        <span><i class="fas fa-layer-group"></i> ${product.activity}</span>
                        <span><i class="fas fa-calendar"></i> ${product.date}</span>
                    </div>
                    <div class="details-actions">
                        <button class="share-product-btn">
                            <i class="fas fa-share"></i> Partager ce produit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Événements
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Partager le produit
    modal.querySelector('.share-product-btn').addEventListener('click', () => {
        const shareText = `Découvrez "${product.name}" pour ${product.price} sur ESEN Business Platform!`;
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Texte copié dans le presse-papier !');
        }
    });
}

// Éditer un produit
function editProduct(productId) {
    const products = productsData[currentActivity] || [];
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        alert('Produit non trouvé');
        return;
    }
    
    const product = products[productIndex];
    
    // Demander les nouvelles informations
    const newName = prompt('Nouveau nom du produit:', product.name);
    if (newName === null) return;
    
    const newPrice = prompt('Nouveau prix (DT):', product.price.replace(' ' + DEFAULT_CURRENCY, ''));
    if (newPrice === null) return;
    
    // Validation du prix
    const priceValue = parseFloat(newPrice.replace(',', '.'));
    if (isNaN(priceValue) || priceValue <= 0) {
        alert('Prix invalide');
        return;
    }
    
    // Demander si on veut changer l'image
    const changeImage = confirm('Voulez-vous changer l\'image du produit ?');
    
    if (changeImage) {
        createImageModal().then(newImage => {
            // Mettre à jour le produit
            productsData[currentActivity][productIndex] = {
                ...product,
                name: newName.trim() || product.name,
                price: priceValue.toFixed(3) + ' ' + DEFAULT_CURRENCY,
                image: newImage || product.image,
                timestamp: Date.now()
            };
            
            // Sauvegarder
            localStorage.setItem('esenProducts', JSON.stringify(productsData));
            
            // Mettre à jour l'affichage
            displayProducts(currentActivity);
            
            alert('✅ Produit modifié avec succès!');
        });
    } else {
        // Mettre à jour le produit sans changer l'image
        productsData[currentActivity][productIndex] = {
            ...product,
            name: newName.trim() || product.name,
            price: priceValue.toFixed(3) + ' ' + DEFAULT_CURRENCY,
            timestamp: Date.now()
        };
        
        // Sauvegarder
        localStorage.setItem('esenProducts', JSON.stringify(productsData));
        
        // Mettre à jour l'affichage
        displayProducts(currentActivity);
        
        alert('✅ Produit modifié avec succès!');
    }
}

// Supprimer un produit
function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }
    
    const products = productsData[currentActivity] || [];
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        alert('Produit non trouvé');
        return;
    }
    
    // Supprimer le produit
    productsData[currentActivity].splice(productIndex, 1);
    
    // Sauvegarder
    localStorage.setItem('esenProducts', JSON.stringify(productsData));
    
    // Mettre à jour l'affichage
    displayProducts(currentActivity);
    
    alert('✅ Produit supprimé avec succès!');
}

// Gestion de la connexion
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    loginModal.classList.remove('active');
});

// Fermer la modal en cliquant en dehors
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }
});

// Soumission du formulaire de connexion
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const businessName = document.getElementById('businessName').value.trim();
    
    if (!email || !password) {
        alert('Veuillez remplir l\'email et le mot de passe');
        return;
    }
    
    // Validation de base
    if (!email.includes('@') || !email.includes('.')) {
        alert('Veuillez entrer un email valide');
        return;
    }
    
    if (password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    // Compte démo
    if (email === 'demo@esen.com' && password === 'password123') {
        currentUser = {
            email: email,
            businessName: businessName || 'Mon Business ESEN'
        };
    } else {
        currentUser = {
            email: email,
            businessName: businessName || email.split('@')[0]
        };
    }
    
    // Sauvegarder l'utilisateur
    localStorage.setItem('esenCurrentUser', JSON.stringify(currentUser));
    
    // Mettre à jour l'affichage
    updateUserDisplay();
    
    // Fermer la modal
    loginModal.classList.remove('active');
    
    // Réinitialiser le formulaire
    loginForm.reset();
    
    // Message de bienvenue
    alert(`✅ Bienvenue ${currentUser.email}!\n\nVotre compte a été créé avec succès.\n💰 Devise: ${DEFAULT_CURRENCY} (Dinar Tunisien)\n📸 Vous pouvez maintenant ajouter des produits avec images!`);
});

// Mettre à jour l'affichage de l'utilisateur
function updateUserDisplay() {
    if (currentUser) {
        userInfo.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <div class="user-details">
                <span class="user-email">${currentUser.email}</span>
                <span class="user-business">${currentUser.businessName}</span>
                <span class="user-currency">Devise: ${DEFAULT_CURRENCY}</span>
            </div>
        `;
        loginBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Déconnexion`;
        loginBtn.classList.add('logout');
        
        // Changer l'événement pour la déconnexion
        loginBtn.onclick = logout;
    } else {
        userInfo.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span>Non connecté</span>
        `;
        loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Connexion`;
        loginBtn.classList.remove('logout');
        
        // Changer l'événement pour la connexion
        loginBtn.onclick = () => loginModal.classList.add('active');
    }
}

// Déconnexion
function logout() {
    if (confirm('Voulez-vous vous déconnecter ?')) {
        currentUser = null;
        currentActivity = null;
        localStorage.removeItem('esenCurrentUser');
        updateUserDisplay();
        
        // Cacher la section produits
        productsSection.classList.remove('active');
        
        alert('✅ Vous avez été déconnecté.');
    }
}

// Permettre l'ajout avec la touche Entrée
newBusinessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le changement d'image de fond
    changeBackground();
    setInterval(changeBackground, 8000);
    
    // Initialiser les boutons
    initializeBusinessButtons();
    
    // Mettre à jour l'affichage utilisateur
    updateUserDisplay();
    
    // Charger les données des produits
    if (localStorage.getItem('esenProducts')) {
        productsData = JSON.parse(localStorage.getItem('esenProducts'));
    }
    
    // Afficher un message de bienvenue si nouvel utilisateur
    if (!localStorage.getItem('esenFirstVisit')) {
        setTimeout(() => {
            alert(`🎉 BIENVENUE SUR ESEN BUSINESS PLATFORM! 🎉\n\n📋 Nouvelles fonctionnalités :\n1. 🔐 Connexion sécurisée\n2. 💎 Devise: ${DEFAULT_CURRENCY} (Dinar Tunisien)\n3. 📸 Ajout d'images pour chaque produit\n4. 🖼️ Galerie de produits avec images\n5. ✏️ Édition et suppression facile\n\n👉 Utilisez le compte démo: demo@esen.com / password123`);
        }, 1000);
        localStorage.setItem('esenFirstVisit', 'true');
    }
});