import { chromium } from 'playwright'

/**
 * Visual Proof Screenshot — SCR-05 Attendance History
 *
 * Captures the proof page at the approved desktop viewport (1600x900)
 * for comparison with Stitch export screenshot.
 */

async function captureProof() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
  })
  const page = await context.newPage()

  await page.goto('http://localhost:3000/attendance', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000) // Wait for fonts + render

  // Desktop screenshot
  await page.screenshot({
    path: 'proof-screenshots/scr-05-desktop.png',
    fullPage: false,
  })

  // Mobile screenshot (375px iPhone)
  await page.setViewportSize({ width: 375, height: 812 })
  await page.waitForTimeout(1000)
  await page.screenshot({
    path: 'proof-screenshots/scr-05-mobile.png',
    fullPage: false,
  })

  await browser.close()
  console.log('Screenshots saved to proof-screenshots/')
}

captureProof().catch(console.error)
