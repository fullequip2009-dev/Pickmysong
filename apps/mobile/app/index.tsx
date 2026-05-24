import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FEATURES = [
  { emoji: '🎧', label: 'Vota canciones' },
  { emoji: '🎵', label: 'Descubre artistas' },
  { emoji: '📊', label: 'Rankings en vivo' },
  { emoji: '🏪', label: 'Locales' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.emoji}>🎵</Text>
          <Text style={styles.brand}>
            Pick<Text style={styles.brandAccent}>my</Text>song
          </Text>
          <Text style={styles.tagline}>
            La música que define tu estilo de vida
          </Text>
        </View>

        {/* Feature Grid */}
        <View style={styles.grid}>
          {FEATURES.map((feature) => (
            <View key={feature.label} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaPrimary} activeOpacity={0.8}>
          <Text style={styles.ctaPrimaryText}>Empieza ahora</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctaSecondary} activeOpacity={0.8}>
          <Text style={styles.ctaSecondaryText}>Explorar sin registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  brand: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -2,
    marginBottom: 16,
  },
  brandAccent: {
    color: '#a855f7',
  },
  tagline: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginBottom: 40,
  },
  featureCard: {
    width: (width - 72) / 2,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureLabel: {
    fontSize: 13,
    color: '#d1d5db',
    textAlign: 'center',
    fontWeight: '500',
  },
  ctaPrimary: {
    backgroundColor: '#a855f7',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
    marginBottom: 12,
    width: width - 48,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaSecondary: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
    width: width - 48,
    alignItems: 'center',
  },
  ctaSecondaryText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
});
