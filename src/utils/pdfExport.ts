import { jsPDF } from 'jspdf';
import { Recipe, BatchLunch, WeeklyPlan } from '../types';

/**
 * Cleanly wraps and adds text to jsPDF, tracking Y position and handling page overflow
 */
class PdfDocumentBuilder {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  currentY: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 40;
    this.contentWidth = this.pageWidth - this.margin * 2;
    this.currentY = this.margin;
  }

  checkPageBreak(neededHeight: number) {
    if (this.currentY + neededHeight > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
      this.drawHeaderFooter();
    }
  }

  drawHeaderFooter(docTitle = 'Family Meal Planner & Dietary Guide') {
    const totalPages = this.doc.getNumberOfPages ? this.doc.getNumberOfPages() : 1;
    const currentPage = this.doc.getCurrentPageInfo ? this.doc.getCurrentPageInfo().pageNumber : 1;

    // Subtle header rule & text
    this.doc.setFontSize(8);
    this.doc.setTextColor(140, 130, 120);
    this.doc.text(docTitle, this.margin, 25);
    this.doc.text(`Page ${currentPage}`, this.pageWidth - this.margin, 25, { align: 'right' });
    this.doc.setDrawColor(220, 215, 205);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 30, this.pageWidth - this.margin, 30);
  }

  addTitle(title: string, subtitle?: string) {
    this.checkPageBreak(50);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(18);
    this.doc.setTextColor(35, 30, 25);
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 22;

    if (subtitle) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 95, 90);
      this.doc.text(subtitle, this.margin, this.currentY);
      this.currentY += 16;
    }

    this.doc.setDrawColor(200, 150, 60);
    this.doc.setLineWidth(1.5);
    this.doc.line(this.margin, this.currentY, this.margin + 60, this.currentY);
    this.currentY += 15;
  }

  addSectionHeader(text: string, icon = '•') {
    this.checkPageBreak(30);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(160, 100, 30);
    this.doc.text(`${icon} ${text.toUpperCase()}`, this.margin, this.currentY);
    this.currentY += 15;
  }

  addCalloutBox(title: string, content: string, noteColor: [number, number, number] = [245, 240, 230]) {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    const splitContent = this.doc.splitTextToSize(content, this.contentWidth - 24);
    const boxHeight = 20 + splitContent.length * 12;

    this.checkPageBreak(boxHeight + 10);

    // Box background
    this.doc.setFillColor(noteColor[0], noteColor[1], noteColor[2]);
    this.doc.setDrawColor(215, 200, 180);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, boxHeight, 4, 4, 'FD');

    // Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(60, 45, 30);
    this.doc.text(title, this.margin + 12, this.currentY + 14);

    // Body
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 70, 60);
    this.doc.text(splitContent, this.margin + 12, this.currentY + 26);

    this.currentY += boxHeight + 12;
  }

  addParagraph(text: string, size = 9, isBold = false) {
    this.doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(50, 45, 40);
    const lines = this.doc.splitTextToSize(text, this.contentWidth);
    this.checkPageBreak(lines.length * (size + 3));
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * (size + 3) + 6;
  }

  addDetailedRecipe(recipe: Recipe) {
    // 1. Category Eyebrow
    const categoryEyebrow = recipe.isLeftoverNight
      ? 'LEFTOVER NIGHT'
      : (recipe.isSlowCooker ? 'SLOW COOKER DINNER' : 'FRESH DINNER');
    
    this.checkPageBreak(50);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(150, 140, 130);
    this.doc.text(categoryEyebrow, this.margin, this.currentY);
    this.currentY += 14;

    // 2. Main Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.setTextColor(30, 25, 20);
    const titleLines = this.doc.splitTextToSize(recipe.title, this.contentWidth);
    this.doc.text(titleLines, this.margin, this.currentY);
    this.currentY += titleLines.length * 18 + 4;

    // 3. Timing & Portions
    const prep = recipe.prepMinutes || recipe.activePrepMinutes || 15;
    const cook = recipe.cookMinutes || Math.max(0, (recipe.totalTimeMinutes || 25) - prep);
    const timingStr = `Prep ${prep} min  •  Cook ${cook} min  •  ${recipe.servings || 4} Portions`;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(110, 100, 90);
    this.doc.text(timingStr, this.margin, this.currentY);
    this.currentY += 16;

    // Divider line
    this.doc.setDrawColor(225, 215, 200);
    this.doc.setLineWidth(1);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 16;

    // 4. INGREDIENTS Section
    this.checkPageBreak(30);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(50, 45, 40);
    this.doc.text('INGREDIENTS', this.margin, this.currentY);
    this.currentY += 14;

    (recipe.ingredients || []).forEach((ing) => {
      this.checkPageBreak(15);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.setTextColor(60, 55, 50);
      const ingText = `•  ${ing.amount ? ing.amount + ' ' : ''}${ing.item}`;
      const splitIng = this.doc.splitTextToSize(ingText, this.contentWidth - 10);
      this.doc.text(splitIng, this.margin + 4, this.currentY);
      this.currentY += splitIng.length * 12 + 2;
    });

    // Add modular side toppings directly under ingredients
    if (recipe.modularToppings && recipe.modularToppings.length > 0) {
      recipe.modularToppings.forEach((top) => {
        this.checkPageBreak(15);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setFontSize(9);
        this.doc.setTextColor(70, 90, 130);
        const topText = `•  Modular Side for Stephen: ${top}`;
        const splitTop = this.doc.splitTextToSize(topText, this.contentWidth - 10);
        this.doc.text(splitTop, this.margin + 4, this.currentY);
        this.currentY += splitTop.length * 12 + 2;
      });
    }
    this.currentY += 10;

    // 5. STEPS Section
    this.checkPageBreak(30);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(50, 45, 40);
    this.doc.text('STEPS', this.margin, this.currentY);
    this.currentY += 14;

    (recipe.instructions || []).forEach((step, idx) => {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.setTextColor(45, 40, 35);
      const stepPrefix = `${idx + 1}. `;
      const prefixWidth = this.doc.getTextWidth(stepPrefix) + 3;
      const stepLines = this.doc.splitTextToSize(step, this.contentWidth - prefixWidth);
      const stepBlockHeight = stepLines.length * 12 + 4;
      
      this.checkPageBreak(stepBlockHeight + 6);

      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(60, 50, 40);
      this.doc.text(stepPrefix, this.margin + 4, this.currentY);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(45, 40, 35);
      this.doc.text(stepLines, this.margin + 4 + prefixWidth, this.currentY);

      this.currentY += stepBlockHeight;
    });
    this.currentY += 12;

    // 6. Logan Toddler Modification Banner (Amber-tinted box matching example)
    if (recipe.toddlerModification) {
      const toddlerContent = `Logan: ${recipe.toddlerModification.instructions}${
        recipe.toddlerModification.fingerFoodTips ? ' Tip: ' + recipe.toddlerModification.fingerFoodTips : ''
      }`;
      this.addCalloutBox(
        "TODDLER MODIFICATION",
        toddlerContent,
        [254, 249, 235] // Amber warm tint matching screenshot
      );
    }

    // 7. Taryn 100% Dairy Free Verification Note
    if (recipe.dairyFreeNotes) {
      this.addCalloutBox(
        "TARYN 100% DAIRY-FREE PROTOCOL",
        recipe.dairyFreeNotes,
        [240, 249, 245]
      );
    }
  }
}

/**
 * Render a single Recipe to PDF
 */
export function exportRecipeToPdf(recipe: Recipe) {
  const builder = new PdfDocumentBuilder();
  builder.drawHeaderFooter(`Family Meal Planner • ${recipe.title}`);
  builder.addDetailedRecipe(recipe);

  // Save PDF
  const sanitizedTitle = recipe.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  builder.doc.save(`${sanitizedTitle}.pdf`);
}

/**
 * Render a Batch Lunch to PDF
 */
export function exportBatchLunchToPdf(lunch: BatchLunch) {
  const builder = new PdfDocumentBuilder();
  builder.drawHeaderFooter(`Batch Lunch Prep • ${lunch.title}`);

  const lunchAsRecipe: Recipe = {
    id: lunch.id,
    title: lunch.title,
    cuisine: 'Batch Lunch Prep',
    flavorProfile: lunch.flavorProfile,
    day: `Batch Lunch (Prepped ${lunch.prepDay})`,
    activePrepMinutes: lunch.prepMinutes || 25,
    totalTimeMinutes: (lunch.prepMinutes || 25) + (lunch.cookMinutes || 20),
    prepMinutes: lunch.prepMinutes || 25,
    cookMinutes: lunch.cookMinutes || 20,
    isSlowCooker: false,
    servings: lunch.servings,
    dairyFreeNotes: lunch.dairyFreeNotes,
    toddlerModification: lunch.toddlerModification,
    modularToppings: [lunch.workPackagingTips, lunch.homeReheatTips].filter(Boolean),
    ingredients: lunch.ingredients,
    instructions: lunch.instructions,
  };
  builder.addDetailedRecipe(lunchAsRecipe);

  const sanitizedTitle = lunch.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  builder.doc.save(`${sanitizedTitle}.pdf`);
}

/**
 * Render all recipes and batch lunches as a complete Batch Weekly Document
 */
export function exportBatchRecipesToPdf(weeklyPlan: WeeklyPlan) {
  const builder = new PdfDocumentBuilder();

  // Page 1: Weekly Cover / Summary
  builder.drawHeaderFooter(`Weekly Meal Guide • ${weeklyPlan.weekOf || 'Current Week'}`);
  builder.addTitle(weeklyPlan.title, `Weekly Meal Plan Guide (${weeklyPlan.dinnersCount} Dinners + ${weeklyPlan.leftoverCount} Leftovers + 2 Batch Lunches)`);
  
  builder.addCalloutBox(
    "Weekly Rhythm Overview",
    weeklyPlan.summary,
    [245, 240, 230]
  );

  builder.addSectionHeader('Weekly Dinner Schedule');
  weeklyPlan.dinners.forEach((d) => {
    builder.checkPageBreak(32);
    builder.doc.setFont('helvetica', 'bold');
    builder.doc.setFontSize(9.5);
    builder.doc.setTextColor(30, 30, 30);
    builder.doc.text(d.day, builder.margin + 8, builder.currentY);

    builder.doc.setFont('helvetica', 'normal');
    builder.doc.setTextColor(80, 80, 80);
    builder.doc.text(d.title, builder.margin + 140, builder.currentY);

    if (d.isLeftoverNight) {
      builder.doc.setFont('helvetica', 'italic');
      builder.doc.setTextColor(140, 90, 20);
      builder.doc.text('(Encore / Leftover)', builder.pageWidth - builder.margin - 8, builder.currentY, { align: 'right' });
    }

    builder.currentY += 18;
  });

  builder.currentY += 10;
  builder.addSectionHeader('Batch Lunches (Sundays & Tuesdays)');
  weeklyPlan.batchLunches.forEach((l) => {
    builder.checkPageBreak(30);
    builder.doc.setFont('helvetica', 'bold');
    builder.doc.setFontSize(9.5);
    builder.doc.setTextColor(30, 30, 30);
    builder.doc.text(`Prepped ${l.prepDay}:`, builder.margin + 8, builder.currentY);

    builder.doc.setFont('helvetica', 'normal');
    builder.doc.setTextColor(80, 80, 80);
    builder.doc.text(l.title, builder.margin + 120, builder.currentY);
    builder.currentY += 18;
  });

  // Subsequent pages: Individual recipes
  const freshDinners = weeklyPlan.dinners.filter(d => !d.isLeftoverNight);
  freshDinners.forEach((recipe) => {
    builder.doc.addPage();
    builder.currentY = builder.margin;
    builder.drawHeaderFooter(`Weekly Meal Guide • Dinner Recipe`);
    builder.addDetailedRecipe(recipe);
  });

  // Batch lunches pages
  weeklyPlan.batchLunches.forEach((lunch) => {
    builder.doc.addPage();
    builder.currentY = builder.margin;
    builder.drawHeaderFooter(`Weekly Meal Guide • Batch Lunch Recipe`);

    // Convert lunch to Recipe-like structure for uniform detailed layout
    const lunchAsRecipe: Recipe = {
      id: lunch.id,
      title: lunch.title,
      cuisine: 'Batch Lunch Prep',
      flavorProfile: lunch.flavorProfile,
      day: `Prepped on ${lunch.prepDay}`,
      activePrepMinutes: lunch.prepMinutes || 25,
      totalTimeMinutes: (lunch.prepMinutes || 25) + (lunch.cookMinutes || 20),
      prepMinutes: lunch.prepMinutes || 25,
      cookMinutes: lunch.cookMinutes || 20,
      isSlowCooker: false,
      servings: lunch.servings,
      dairyFreeNotes: lunch.dairyFreeNotes,
      toddlerModification: lunch.toddlerModification,
      modularToppings: [lunch.workPackagingTips, lunch.homeReheatTips].filter(Boolean),
      ingredients: lunch.ingredients,
      instructions: lunch.instructions,
    };
    builder.addDetailedRecipe(lunchAsRecipe);
  });

  // Save batch PDF
  const weekLabel = (weeklyPlan.weekOf || 'current-week').toLowerCase().replace(/[^a-z0-9]/g, '-');
  builder.doc.save(`weekly-recipes-batch-${weekLabel}.pdf`);
}
