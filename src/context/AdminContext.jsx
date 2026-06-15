import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AdminContext = createContext();

// Export the hook as NAMED export
export const useAdmin = () => useContext(AdminContext);

// List of admin emails - ADD YOUR EMAILS HERE
const ADMIN_EMAILS = [
    'kitacleanbavaria@gmail.com',
];

// Export the provider as NAMED export (NO default export!)
export const AdminProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        let unsubscribe = () => {};

        const subscribeToAuth = async () => {
            try {
                const [{ onAuthStateChanged }, { doc, getDoc, setDoc }, { auth, db }] = await Promise.all([
                    import('firebase/auth'),
                    import('firebase/firestore'),
                    import('../firebase/config'),
                ]);

                if (!active) return;

                unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                    if (!active) return;
                    setUser(currentUser);

                    if (currentUser) {
                        try {
                            // Check if user exists in users collection
                            const userDocRef = doc(db, 'users', currentUser.uid);
                            const userDoc = await getDoc(userDocRef);

                            if (userDoc.exists()) {
                                const userData = userDoc.data();
                                const hasAdminRole = userData.role === 'admin';
                                const isAdminEmail = ADMIN_EMAILS.includes(currentUser.email);
                                setIsAdmin(hasAdminRole || isAdminEmail);
                            } else {
                                // User not in database, create them
                                await setDoc(userDocRef, {
                                    email: currentUser.email,
                                    displayName: currentUser.displayName || '',
                                    role: 'user',
                                    createdAt: new Date().toISOString()
                                });
                                setIsAdmin(ADMIN_EMAILS.includes(currentUser.email));
                            }
                        } catch (error) {
                            console.error('Error checking admin status:', error);
                            setIsAdmin(ADMIN_EMAILS.includes(currentUser?.email));
                        }
                    } else {
                        setIsAdmin(false);
                    }

                    setLoading(false);
                });
            } catch (error) {
                console.error('Error setting up auth:', error);
                if (active) setLoading(false);
            }
        };

        subscribeToAuth();

        return () => {
            active = false;
            unsubscribe();
        };
    }, []);

    return (
        <AdminContext.Provider value={{ user, isAdmin, loading }}>
            {children}
        </AdminContext.Provider>
    );
};

// NO default export!
