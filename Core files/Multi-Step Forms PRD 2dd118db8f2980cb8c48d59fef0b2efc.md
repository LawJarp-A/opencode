# Multi-Step Forms PRD

## Generative UI for Data Collection

**Author:** Product Team

**Date:** January 2, 2026

Figma: [https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=1039-198880](https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=1039-198880)

## 🎯 The Problem

**Current State:** Every Space in ShopOS requires different inputs. Some need basic info (brand name, product type), others need complex data (compliance rules, creative preferences, technical specifications). Right now, we face several issues:

1. **Static forms don't scale** → Each Space has hardcoded forms that need developer changes
2. **Poor mobile experience** → Long forms with 20+ fields overwhelm users on mobile
3. **High drop-off rates** → Users abandon forms because they're too long or confusing
4. **No learning** → Forms don't adapt based on user behavior or previous inputs
5. **Inconsistent UX** → Each Space feels different because forms are built ad-hoc

## Figma:

## 💡 The Solution: Multi-Step Forms

**What:** Generative UI that dynamically creates optimized forms for each Space based on:

- Space requirements (what data is needed)
- User context (what we already know from Brand Memory)
- User behavior (drop-off patterns, completion data)

**Key Components:**

1. **ProgressBar**: Visual indicator of form progress
2. **FormStep**: Renders 3-5 fields for current step
3. **FormField**: Individual field component (text, select, checkbox, etc.)
4. **ValidationEngine**: Real-time validation on blur
5. **PrefillEngine**: Pulls data from Brand Memory
6. **AutoSave**: Saves progress to localStorage every 5 seconds

**Why This Works:**

- Lower cognitive load (focus on 2-3 questions at once)
- Clear progress (step 2 of 4)
- Easy to go back and edit

## 📊 Success Metrics

### Primary Metrics

| Metric | Current | Target | Measurement |
| --- | --- | --- | --- |
| **Form Completion Rate** | 60% | 80% | (Completed forms / Started forms) × 100 |
|  |  |  |  |
| **Time to Complete** | 8-12 min | <5 min | Median time from start to submit |
| **Drop-Off Rate per Step** | Varies | <10% per step | Users who abandon at each step |
| **Error Rate** | 25% | <10% | Forms submitted with validation errors |

### Secondary Metrics

| Metric | Target | Measurement |
| --- | --- | --- |
| **Prefill Accuracy** | 95% | Correctly pre-filled fields from Brand Memory |
| **Returning User Speed** | <2 min | Time for users with existing Brand Memory |
| **Field-Level Drop-Off** | Tracked | Identify problematic fields |