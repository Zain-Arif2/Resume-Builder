import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingHorizontal: 38,
    paddingBottom: 35,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    lineHeight: 1.5,
  },

  header: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },

  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
  },

  jobTitle: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 10,
  },

  contact: {
    fontSize: 9,
    color: "#4B5563",
    marginBottom: 3,
  },

  section: {
    marginTop: 18,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
    marginBottom: 10,
  },

  item: {
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 11,
    fontWeight: "bold",
  },

  company: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
    marginBottom: 4,
  },

  date: {
    fontSize: 9,
    color: "#6B7280",
  },

  paragraph: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },

  bullet: {
    marginLeft: 8,
    fontSize: 10,
    marginBottom: 2,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },

  skill: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 9,
  },
});

function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function ResumePDFDocument({ data }) {
  const { personalInfo = {}, professionalSummary, experience = [], education = [], skills = [] } = data || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>

          <Text style={styles.name}>
            {personalInfo.fullName || "Your Name"}
          </Text>

          <Text style={styles.jobTitle}>
            {personalInfo.jobTitle || "Professional Title"}
          </Text>

          <Text style={styles.contact}>
            {[personalInfo.email,
            personalInfo.phone,
            personalInfo.city,
            personalInfo.country]
              .filter(Boolean)
              .join(" • ")}
          </Text>

          <Text style={styles.contact}>
            {[personalInfo.linkedin,
            personalInfo.github,
            personalInfo.website]
              .filter(Boolean)
              .join(" • ")}
          </Text>

        </View>        <Text style={styles.contact}>
          {[personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.country].filter(Boolean).join(' | ')}
        </Text>
        <Text style={styles.contact}>
          {[personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).join(' | ')}
        </Text>
        <View style={styles.divider} />

        {professionalSummary ? (
         <View style={styles.section}>
    <Text style={styles.sectionTitle}>
        PROFESSIONAL SUMMARY
    </Text>

    <Text style={styles.paragraph}>
        {professionalSummary}
    </Text>
</View>
        ) : null}

        {experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.dateText}>
                    {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {(exp.description || '').split('\n').filter(Boolean).map((line, j) => (
                  <Text key={j} style={styles.bullet}>- {line}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={styles.row}>
                  <Text style={styles.title}>
                    {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                <Text style={styles.company}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
         <View style={styles.skillsContainer}>
  {skills.map((skill, index) => (
    <Text key={index} style={styles.skill}>
      {skill.name}
    </Text>
  ))}
</View>
        )}
      </Page>
    </Document>
  );
}
