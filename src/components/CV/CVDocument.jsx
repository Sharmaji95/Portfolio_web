import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 10,
    },
    name: {
        fontSize: 22, // Slightly smaller
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#000', // Black for better ATS
    },
    role: {
        fontSize: 12,
        color: '#444',
        marginTop: 4,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#000',
        textTransform: 'uppercase',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        paddingBottom: 2,
    },
    text: {
        fontSize: 10,
        color: '#333',
        lineHeight: 1.4,
        marginBottom: 3,
    },
    skillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        fontSize: 9,
        backgroundColor: '#f3f4f6',
        color: '#000',
        padding: '2px 6px',
        borderRadius: 2,
    },
    projectTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    projectMeta: {
        fontSize: 9,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 2,
    }
});

const CVDocument = ({ profile, projects, experiences, education }) => {
    if (!profile) return <Document><Page size="A4"></Page></Document>;

    // Use skills from profile or default list if not present
    const skills = [
        'Python', 'SQL', 'Tableau', 'PowerBI', 'Excel',
        'Machine Learning', 'Pandas', 'Scikit-Learn', 'Streamlit',
        'Data Visualization', 'Statistical Analysis', 'ETL Pipelines'
    ];

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.role}>{profile.title}</Text>
                    <Text style={styles.text}>
                        {profile.socialLinks?.email || 'email@example.com'}
                        {profile.phone ? ` | ${profile.phone}` : ''}
                        {profile.socialLinks?.linkedin ? ` | ${profile.socialLinks.linkedin}` : ''}
                        {profile.socialLinks?.github ? ` | ${profile.socialLinks.github}` : ''}
                    </Text>
                </View>

                {/* Summary */}
                <View style={[styles.section, { marginBottom: 10 }]}>
                    <Text style={styles.sectionTitle}>Professional Summary</Text>
                    <Text style={styles.text}>{profile.bio}</Text>
                </View>

                {/* Skills */}
                <View style={[styles.section, { marginBottom: 10 }]}>
                    <Text style={styles.sectionTitle}>Technical Skills</Text>
                    <View style={styles.skillRow}>
                        {skills.map(skill => (
                            <Text key={skill} style={styles.skillBadge}>{skill}</Text>
                        ))}
                    </View>
                </View>

                {/* Experience */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Work Experience</Text>
                    {experiences && experiences.map(exp => (
                        <View key={exp.id} style={{ marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <Text style={styles.projectTitle}>{exp.role}</Text>
                                <Text style={styles.projectMeta}>{exp.period}</Text>
                            </View>
                            <Text style={[styles.projectMeta, { color: '#0f172a', fontWeight: 'bold' }]}>{exp.company}</Text>
                            <Text style={[styles.text, { marginTop: 2 }]}>{exp.description}</Text>
                        </View>
                    ))}
                </View>

                {/* Projects */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Projects</Text>
                    {projects && projects.filter(p => p.status === 'Active').map(p => (
                        <View key={p.id} style={{ marginBottom: 10 }}>
                            <Text style={styles.projectTitle}>{p.title}</Text>
                            <Text style={styles.projectMeta}>{p.category} | {Array.isArray(p.tools) ? p.tools.join(', ') : p.tools}</Text>
                            <Text style={styles.text}>• {p.impact}</Text>
                            <Text style={styles.text}>• {p.solution}</Text>
                        </View>
                    ))}
                </View>

                {/* Education */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {education && education.map(edu => (
                        <View key={edu.id} style={{ marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.projectTitle, { fontSize: 11 }]}>{edu.degree}</Text>
                                <Text style={styles.projectMeta}>{edu.period}</Text>
                            </View>
                            <Text style={styles.text}>{edu.institution}</Text>
                        </View>
                    ))}
                </View>

                <Text style={{ position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: '#94a3b8', fontSize: 10 }}>
                    Generated by Auto-CV Hybrid System
                </Text>
            </Page>
        </Document>
    );
};

export default CVDocument;
