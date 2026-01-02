"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { User } from "@/db/schema"; // Assuming this type matches your Drizzle schema, or minimal interface

// Register fonts
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helvetica/v1/0.ttf' }, // Standard
        { src: 'https://fonts.gstatic.com/s/helvetica/v1/0.ttf', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 10,
        color: '#666',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
        backgroundColor: '#f6f6f6',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        paddingBottom: 2,
    },
    label: {
        width: '30%',
        fontWeight: 'bold',
        color: '#666',
    },
    value: {
        width: '70%',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#999',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
});

export const CustomerPdf = ({ user }: { user: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Customer Profile</Text>
                <Text style={styles.subtitle}>Honesty Print House User Database Record</Text>
            </View>

            {/* Personal Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{user.name || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{user.email}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{user.phone || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Member Since:</Text>
                    <Text style={styles.value}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</Text>
                </View>
            </View>

            {/* Address Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shipping Address</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Street Address:</Text>
                    <Text style={styles.value}>{user.address || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Apartment/Unit:</Text>
                    <Text style={styles.value}>{user.apartment || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>City:</Text>
                    <Text style={styles.value}>{user.city || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Postal Code:</Text>
                    <Text style={styles.value}>{user.postalCode || "N/A"}</Text>
                </View>
            </View>

            {/* Account Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Status</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Role:</Text>
                    <Text style={styles.value}>{user.role || "USER"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>ID:</Text>
                    <Text style={styles.value}>{user.id}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text>Generated on {new Date().toLocaleDateString()} by Honest Print House Admin Portal</Text>
            </View>

        </Page>
    </Document>
);
