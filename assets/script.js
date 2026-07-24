(function() {
  'use strict';

  // ============================================================
  //  DOM REFERENCES
  // ============================================================
  const filterButtons = document.querySelectorAll('#filterGroup .btn');
  const categorySections = document.querySelectorAll('.category-section');
  const allProductItems = document.querySelectorAll('.product-item');
  const itemCountSpan = document.getElementById('itemCount');
  const sortSelect = document.getElementById('sortSelect');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // Micro filter (wired/wireless)
  const microFilterBtns = document.querySelectorAll('#microFilterGroup .btn');
  let activeMicroFilter = 'all';

  // Crown filter (4ch/2ch/authority)
  const crownFilterBtns = document.querySelectorAll('#crownFilterGroup .btn');
  let activeCrownFilter = 'all';

  // Modal elements
  const modalProductName = document.getElementById('modalProductName');
  const modalProductId = document.getElementById('modalProductId');
  const modalProductDesc = document.getElementById('modalProductDesc');
  const modalProductImg = document.getElementById('modalProductImg');
  const authoritySpecs = document.getElementById('authoritySpecs');
  const specsGrid = document.getElementById('specsGrid');

  let activeFilter = 'all';

  // ============================================================
  //  HELPER FUNCTIONS
  // ============================================================

  // Update item count badge
  function updateItemCount() {
    const visible = document.querySelectorAll('.product-item:not(.d-none)');
    if (itemCountSpan) {
      itemCountSpan.textContent = visible.length;
    }
  }

  // Store original index for sorting reset
  function storeOriginalIndices() {
    allProductItems.forEach((item, index) => {
      item.dataset.originalIndex = index;
    });
  }
  storeOriginalIndices();

  // ============================================================
  //  MICROPHONE FILTER
  // ============================================================
  function applyMicroFilter(mfilter) {
    activeMicroFilter = mfilter;
    microFilterBtns.forEach(btn => {
      const val = btn.dataset.mfilter;
      if (val === mfilter) {
        btn.classList.add('active');
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-primary');
      } else {
        btn.classList.remove('active', 'btn-primary');
        btn.classList.add('btn-outline-secondary');
      }
    });

    const micSection = document.querySelector('.category-section[data-category="microphone"]');
    if (!micSection) return;
    
    const micItems = micSection.querySelectorAll('.product-item');
    micItems.forEach(item => {
      const type = item.dataset.mictype || 'all';
      const section = item.closest('.category-section');
      
      if (section && section.classList.contains('d-none')) {
        item.classList.add('d-none');
        return;
      }
      if (activeFilter !== 'all' && activeFilter !== 'microphone') {
        item.classList.add('d-none');
        return;
      }
      if (mfilter === 'all' || type === mfilter) {
        item.classList.remove('d-none');
      } else {
        item.classList.add('d-none');
      }
    });
    
    if (searchInput.value.trim() !== '') {
      applySearch(searchInput.value.trim());
    }
    applySort(sortSelect.value);
  }

  // ============================================================
  //  CROWN FILTER (Includes ALL Crown Products)
  // ============================================================
  function applyCrownFilter(cfilter) {
    activeCrownFilter = cfilter;
    crownFilterBtns.forEach(btn => {
      const val = btn.dataset.cfilter;
      if (val === cfilter) {
        btn.classList.add('active');
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-primary');
      } else {
        btn.classList.remove('active', 'btn-primary');
        btn.classList.add('btn-outline-secondary');
      }
    });

    // Get ALL crown-related sections
    const crownSections = document.querySelectorAll(
      '.category-section[data-category="crown"], ' +
      '.category-section[data-category="INTRUMENTAL-SPEACKER-SYSTEM"], ' +
      '.category-section[data-category="ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM"], ' +
      '.category-section[data-category="LONG-RANGE-BAFFLE"], ' +
      '.category-section[data-category="KARAOKE-SPEAKER-SYSTEM"], ' +
      '.category-section[data-category="PROFESSIONAL-BAFFLE"], ' +
      '.category-section[data-category="PROFESSIONAL-SUBWOOFER"], ' +
      '.category-section[data-category="KARAOKE-BAFFLE-WITH-AMPLIFIER"]'
    );
    
    crownSections.forEach(section => {
      const items = section.querySelectorAll('.product-item');
      items.forEach(item => {
        const type = item.dataset.crowntype || 'all';
        const sectionElem = item.closest('.category-section');
        
        if (sectionElem && sectionElem.classList.contains('d-none')) {
          item.classList.add('d-none');
          return;
        }
        
        // Check if current filter matches this section
        const sectionCat = sectionElem ? sectionElem.dataset.category : '';
        const crownCategories = ['crown', 'INTRUMENTAL-SPEACKER-SYSTEM', 'ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM', 
                                'LONG-RANGE-BAFFLE', 'KARAOKE-SPEAKER-SYSTEM', 'PROFESSIONAL-BAFFLE', 
                                'PROFESSIONAL-SUBWOOFER', 'KARAOKE-BAFFLE-WITH-AMPLIFIER'];
        const isCrownCategory = crownCategories.includes(sectionCat);
        
        if (activeFilter !== 'all' && isCrownCategory && activeFilter !== sectionCat && activeFilter !== 'crown') {
          item.classList.add('d-none');
          return;
        }
        
        if (cfilter === 'all' || type === cfilter) {
          item.classList.remove('d-none');
        } else {
          item.classList.add('d-none');
        }
      });
    });
    
    if (searchInput.value.trim() !== '') {
      applySearch(searchInput.value.trim());
    }
    applySort(sortSelect.value);
  }

  // ============================================================
  //  MAIN CATEGORY FILTER (UPDATED WITH ALL CATEGORIES)
  // ============================================================
  function applyFilter(category) {
    activeFilter = category;
    
    categorySections.forEach(section => {
      const sectionCat = section.dataset.category;
      let shouldShow = false;
      
      if (category === 'all') {
        shouldShow = true;
      } 
      // Crown Categories
      else if (category === 'crown-instrumental' && sectionCat === 'INTRUMENTAL-SPEACKER-SYSTEM') {
        shouldShow = true;
      } else if (category === 'crown-active' && sectionCat === 'ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM') {
        shouldShow = true;
      } else if (category === 'crown-longrange' && sectionCat === 'LONG-RANGE-BAFFLE') {
        shouldShow = true;
      } else if (category === 'crown-karaoke' && sectionCat === 'KARAOKE-SPEAKER-SYSTEM') {
        shouldShow = true;
      } else if (category === 'crown-baffle' && sectionCat === 'PROFESSIONAL-BAFFLE') {
        shouldShow = true;
      } else if (category === 'crown-subwoofer' && sectionCat === 'PROFESSIONAL-SUBWOOFER') {
        shouldShow = true;
      } else if (category === 'crown-karaoke-baffle' && sectionCat === 'KARAOKE-BAFFLE-WITH-AMPLIFIER') {
        shouldShow = true;
      }
      // Kevler Categories
      else if (category === 'kevler-kv' && sectionCat === 'KEVLER-KV-SERIES') {
        shouldShow = true;
      } else if (category === 'kevler-kr' && sectionCat === 'KEVLER-KR-SERIES') {
        shouldShow = true;
      } else if (category === 'kevler-kr-active' && sectionCat === 'KEVLER-KR-ACTIVE-SERIES') {
        shouldShow = true;
      } else if (category === 'kevler-lite' && sectionCat === 'KEVLER-LITE-SERIES') {
        shouldShow = true;
      } else if (category === 'kevler-eon-hp' && sectionCat === 'KEVLER-EON-HP-SERIES') {
        shouldShow = true;
      } else if (category === 'kevler-eon' && sectionCat === 'KEVLER-EON-SERIES') {
        shouldShow = true;
      // In the applyFilter function, add these category checks after the existing Kevler categories:

} else if (category === 'kevler-wave' && sectionCat === 'KEVLER-WAVE-SERIES') {
  shouldShow = true;
} else if (category === 'kevler-tws' && sectionCat === 'KEVLER-TWS-SERIES') {
  shouldShow = true;
} else if (category === 'kevler-art' && sectionCat === 'KEVLER-ART-SERIES') {
  shouldShow = true;
} else if (category === 'kevler-molded' && sectionCat === 'KEVLER-MOLDED-SPEAKERS') {
  shouldShow = true;
} else if (category === 'kevler-axl' && sectionCat === 'KEVLER-AXL-SERIES') {
  shouldShow = true;
} else if (category === 'kevler-zlx' && sectionCat === 'KEVLER-ZLX-SERIES') {
  shouldShow = true;
}
      
      // General category match
      else if (category === sectionCat) {
        shouldShow = true;
      }
      
      if (shouldShow) {
        section.classList.remove('d-none');
      } else {
        section.classList.add('d-none');
      }
    });

    // Update button active states
    filterButtons.forEach(btn => {
      const filterVal = btn.dataset.filter;
      if (filterVal === category) {
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-primary', 'active');
      } else {
        btn.classList.remove('btn-primary', 'active');
        btn.classList.add('btn-outline-secondary');
      }
    });

    // Apply microphone filter if applicable
    if (category === 'all' || category === 'microphone') {
      applyMicroFilter(activeMicroFilter);
    } else {
      const micSection = document.querySelector('.category-section[data-category="microphone"]');
      if (micSection && micSection.classList.contains('d-none')) {
        micSection.querySelectorAll('.product-item').forEach(item => item.classList.add('d-none'));
      }
    }

    // Apply crown filter for all crown-related categories
    const crownCategories = ['crown', 'crown-instrumental', 'crown-active', 'crown-longrange', 
                           'crown-karaoke', 'crown-baffle', 'crown-subwoofer', 'crown-karaoke-baffle'];
    
    // Apply kevler filter for all kevler-related categories
    const kevlerCategories = ['kevler-kv', 'kevler-kr', 'kevler-kr-active', 'kevler-lite', 
                            'kevler-eon-hp', 'kevler-eon'];
    
    if (category === 'all' || crownCategories.includes(category)) {
      applyCrownFilter(activeCrownFilter);
    } else {
      const crownSections = document.querySelectorAll(
        '.category-section[data-category="crown"], ' +
        '.category-section[data-category="INTRUMENTAL-SPEACKER-SYSTEM"], ' +
        '.category-section[data-category="ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM"], ' +
        '.category-section[data-category="LONG-RANGE-BAFFLE"], ' +
        '.category-section[data-category="KARAOKE-SPEAKER-SYSTEM"], ' +
        '.category-section[data-category="PROFESSIONAL-BAFFLE"], ' +
        '.category-section[data-category="PROFESSIONAL-SUBWOOFER"], ' +
        '.category-section[data-category="KARAOKE-BAFFLE-WITH-AMPLIFIER"]'
      );
      crownSections.forEach(section => {
        if (section.classList.contains('d-none')) {
          section.querySelectorAll('.product-item').forEach(item => item.classList.add('d-none'));
        }
      });
    }

    // Apply search if needed
    if (searchInput.value.trim() !== '') {
      applySearch(searchInput.value.trim());
    } else {
      const visibleSections = Array.from(categorySections).filter(s => !s.classList.contains('d-none'));
      visibleSections.forEach(section => {
        const items = section.querySelectorAll('.product-item');
        items.forEach(item => {
          if (section.dataset.category === 'microphone') {
            const type = item.dataset.mictype || 'all';
            if (activeMicroFilter === 'all' || type === activeMicroFilter) {
              item.classList.remove('d-none');
            } else {
              item.classList.add('d-none');
            }
          } else if (section.dataset.category === 'crown' || 
                     section.dataset.category === 'INTRUMENTAL-SPEACKER-SYSTEM' ||
                     section.dataset.category === 'ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM' ||
                     section.dataset.category === 'LONG-RANGE-BAFFLE' ||
                     section.dataset.category === 'KARAOKE-SPEAKER-SYSTEM' ||
                     section.dataset.category === 'PROFESSIONAL-BAFFLE' ||
                     section.dataset.category === 'PROFESSIONAL-SUBWOOFER' ||
                     section.dataset.category === 'KARAOKE-BAFFLE-WITH-AMPLIFIER') {
            const type = item.dataset.crowntype || 'all';
            if (activeCrownFilter === 'all' || type === activeCrownFilter) {
              item.classList.remove('d-none');
            } else {
              item.classList.add('d-none');
            }
          } else {
            item.classList.remove('d-none');
          }
        });
      });
      updateItemCount();
    }
    applySort(sortSelect.value);
  }

  // ============================================================
  //  SEARCH FUNCTION
  // ============================================================
  function applySearch(term) {
    const lower = term.toLowerCase();
    const visibleSections = Array.from(categorySections).filter(s => !s.classList.contains('d-none'));
    
    allProductItems.forEach(item => {
      const parentSection = item.closest('.category-section');
      if (parentSection && parentSection.classList.contains('d-none')) {
        item.classList.add('d-none');
        return;
      }
      
      const title = item.querySelector('.product-title')?.textContent?.toLowerCase() || '';
      const desc = item.querySelector('.product-desc')?.textContent?.toLowerCase() || '';
      const id = item.querySelector('.badge-id')?.textContent?.toLowerCase() || '';
      const match = title.includes(lower) || desc.includes(lower) || id.includes(lower);
      
      if (lower === '') {
        // Reset visibility based on filters
        if (parentSection && parentSection.dataset.category === 'microphone') {
          const type = item.dataset.mictype || 'all';
          if (activeMicroFilter === 'all' || type === activeMicroFilter) {
            item.classList.remove('d-none');
          } else {
            item.classList.add('d-none');
          }
        } else if (parentSection && (parentSection.dataset.category === 'crown' || 
                   parentSection.dataset.category === 'INTRUMENTAL-SPEACKER-SYSTEM' ||
                   parentSection.dataset.category === 'ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM' ||
                   parentSection.dataset.category === 'LONG-RANGE-BAFFLE' ||
                   parentSection.dataset.category === 'KARAOKE-SPEAKER-SYSTEM' ||
                   parentSection.dataset.category === 'PROFESSIONAL-BAFFLE' ||
                   parentSection.dataset.category === 'PROFESSIONAL-SUBWOOFER' ||
                   parentSection.dataset.category === 'KARAOKE-BAFFLE-WITH-AMPLIFIER')) {
          const type = item.dataset.crowntype || 'all';
          if (activeCrownFilter === 'all' || type === activeCrownFilter) {
            item.classList.remove('d-none');
          } else {
            item.classList.add('d-none');
          }
        } else {
          item.classList.remove('d-none');
        }
      } else {
        if (!match) {
          item.classList.add('d-none');
        } else {
          // Check additional filters
          if (parentSection && parentSection.dataset.category === 'microphone') {
            const type = item.dataset.mictype || 'all';
            if (activeMicroFilter !== 'all' && type !== activeMicroFilter) {
              item.classList.add('d-none');
            } else {
              item.classList.remove('d-none');
            }
          } else if (parentSection && (parentSection.dataset.category === 'crown' || 
                     parentSection.dataset.category === 'INTRUMENTAL-SPEACKER-SYSTEM' ||
                     parentSection.dataset.category === 'ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM' ||
                     parentSection.dataset.category === 'LONG-RANGE-BAFFLE' ||
                     parentSection.dataset.category === 'KARAOKE-SPEAKER-SYSTEM' ||
                     parentSection.dataset.category === 'PROFESSIONAL-BAFFLE' ||
                     parentSection.dataset.category === 'PROFESSIONAL-SUBWOOFER' ||
                     parentSection.dataset.category === 'KARAOKE-BAFFLE-WITH-AMPLIFIER')) {
            const type = item.dataset.crowntype || 'all';
            if (activeCrownFilter !== 'all' && type !== activeCrownFilter) {
              item.classList.add('d-none');
            } else {
              item.classList.remove('d-none');
            }
          } else {
            item.classList.remove('d-none');
          }
        }
      }
    });
    applySort(sortSelect.value);
  }

  // ============================================================
  //  SORT FUNCTION
  // ============================================================
  function applySort(sortType) {
    const visibleSections = Array.from(categorySections).filter(s => !s.classList.contains('d-none'));
    
    visibleSections.forEach(section => {
      const grid = section.querySelector('.product-grid');
      if (!grid) return;
      
      const items = Array.from(grid.querySelectorAll('.product-item:not(.d-none)'));
      if (items.length === 0) return;
      
      items.forEach(item => item.remove());
      
      if (sortType === 'low') {
        items.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
      } else if (sortType === 'high') {
        items.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
      } else {
        items.sort((a, b) => parseInt(a.dataset.originalIndex) - parseInt(b.dataset.originalIndex));
      }
      
      items.forEach(item => grid.appendChild(item));
    });
    updateItemCount();
  }

  // ============================================================
  //  MODAL POPULATE FUNCTION
  // ============================================================
  function populateModal(card) {
    if (!card) return;
    
    // Set basic info
    modalProductName.textContent = card.dataset.name || 'Product';
    modalProductId.textContent = card.dataset.id || 'N/A';
    const descText = card.querySelector('.product-desc')?.textContent?.trim();
    modalProductDesc.textContent = descText || card.dataset.desc || 'No description available.';

    // Set image
    const cardImage = card.querySelector('img');
    const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e6eefc"/%3E%3Ctext x="200" y="150" font-family="Arial" font-size="20" fill="%230A4DBF" text-anchor="middle" dominant-baseline="central"%3E📷 No Image%3C/text%3E%3C/svg%3E';
    const imageSrc = card.dataset.img || cardImage?.getAttribute('src') || fallbackImage;
    modalProductImg.src = imageSrc;
    modalProductImg.alt = card.dataset.name || 'Product';
    modalProductImg.onerror = function() {
      this.src = fallbackImage;
    };

    // Show specs if it's an authority series product
    const specsData = card.dataset.specs;
    const isAuthority = card.dataset.crowntype === 'authority';
    
    if (specsData && isAuthority) {
      authoritySpecs.classList.remove('d-none');
      specsGrid.innerHTML = '';
      try {
        const specs = JSON.parse(specsData);
        for (const [key, val] of Object.entries(specs)) {
          const div = document.createElement('div');
          div.className = 'spec-item';
          div.innerHTML = `<span class="spec-label">${key}</span><span class="spec-value">${val}</span>`;
          specsGrid.appendChild(div);
        }
      } catch (e) {
        specsGrid.innerHTML = '<div class="text-muted">Specifications not available</div>';
      }
    } else {
      authoritySpecs.classList.add('d-none');
    }
  }

  // ============================================================
  //  EVENT LISTENERS
  // ============================================================

  // ----- Main Filter Buttons -----
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const filter = this.dataset.filter;
      applyFilter(filter);
      if (searchInput.value.trim() !== '') {
        applySearch(searchInput.value.trim());
      } else {
        const visibleSections = Array.from(categorySections).filter(s => !s.classList.contains('d-none'));
        visibleSections.forEach(section => {
          const items = section.querySelectorAll('.product-item');
          items.forEach(item => {
            if (section.dataset.category === 'microphone') {
              const type = item.dataset.mictype || 'all';
              if (activeMicroFilter === 'all' || type === activeMicroFilter) {
                item.classList.remove('d-none');
              } else {
                item.classList.add('d-none');
              }
            } else if (section.dataset.category === 'crown' || 
                       section.dataset.category === 'INTRUMENTAL-SPEACKER-SYSTEM' ||
                       section.dataset.category === 'ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM' ||
                       section.dataset.category === 'LONG-RANGE-BAFFLE' ||
                       section.dataset.category === 'KARAOKE-SPEAKER-SYSTEM' ||
                       section.dataset.category === 'PROFESSIONAL-BAFFLE' ||
                       section.dataset.category === 'PROFESSIONAL-SUBWOOFER' ||
                       section.dataset.category === 'KARAOKE-BAFFLE-WITH-AMPLIFIER') {
              const type = item.dataset.crowntype || 'all';
              if (activeCrownFilter === 'all' || type === activeCrownFilter) {
                item.classList.remove('d-none');
              } else {
                item.classList.add('d-none');
              }
            } else {
              item.classList.remove('d-none');
            }
          });
        });
        updateItemCount();
      }
      applySort(sortSelect.value);
    });
  });

  // ----- Micro Filter Buttons -----
  microFilterBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const mfilter = this.dataset.mfilter;
      applyMicroFilter(mfilter);
    });
  });

  // ----- Crown Filter Buttons -----
  crownFilterBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const cfilter = this.dataset.cfilter;
      applyCrownFilter(cfilter);
    });
  });

  // ----- Sort Select -----
  sortSelect.addEventListener('change', function() {
    applySort(this.value);
  });

  // ----- Search -----
  function handleSearch() {
    const term = searchInput.value.trim();
    if (term === '') {
      const visibleSections = Array.from(categorySections).filter(s => !s.classList.contains('d-none'));
      visibleSections.forEach(section => {
        const items = section.querySelectorAll('.product-item');
        items.forEach(item => {
          if (section.dataset.category === 'microphone') {
            const type = item.dataset.mictype || 'all';
            if (activeMicroFilter === 'all' || type === activeMicroFilter) {
              item.classList.remove('d-none');
            } else {
              item.classList.add('d-none');
            }
          } else if (section.dataset.category === 'crown' || 
                     section.dataset.category === 'INTRUMENTAL-SPEACKER-SYSTEM' ||
                     section.dataset.category === 'ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM' ||
                     section.dataset.category === 'LONG-RANGE-BAFFLE' ||
                     section.dataset.category === 'KARAOKE-SPEAKER-SYSTEM' ||
                     section.dataset.category === 'PROFESSIONAL-BAFFLE' ||
                     section.dataset.category === 'PROFESSIONAL-SUBWOOFER' ||
                     section.dataset.category === 'KARAOKE-BAFFLE-WITH-AMPLIFIER') {
            const type = item.dataset.crowntype || 'all';
            if (activeCrownFilter === 'all' || type === activeCrownFilter) {
              item.classList.remove('d-none');
            } else {
              item.classList.add('d-none');
            }
          } else {
            item.classList.remove('d-none');
          }
        });
      });
      applySort(sortSelect.value);
    } else {
      applySearch(term);
    }
  }

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') handleSearch();
  });
  searchInput.addEventListener('input', function() {
    if (this.value.trim() === '') {
      const visibleSections = Array.from(categorySections).filter(s => !s.classList.contains('d-none'));
      visibleSections.forEach(section => {
        const items = section.querySelectorAll('.product-item');
        items.forEach(item => {
          if (section.dataset.category === 'microphone') {
            const type = item.dataset.mictype || 'all';
            if (activeMicroFilter === 'all' || type === activeMicroFilter) {
              item.classList.remove('d-none');
            } else {
              item.classList.add('d-none');
            }
          } else if (section.dataset.category === 'crown' || 
                     section.dataset.category === 'INTRUMENTAL-SPEACKER-SYSTEM' ||
                     section.dataset.category === 'ACTIVE-INSTRUMENTAL-SPEAKER-SYSTEM' ||
                     section.dataset.category === 'LONG-RANGE-BAFFLE' ||
                     section.dataset.category === 'KARAOKE-SPEAKER-SYSTEM' ||
                     section.dataset.category === 'PROFESSIONAL-BAFFLE' ||
                     section.dataset.category === 'PROFESSIONAL-SUBWOOFER' ||
                     section.dataset.category === 'KARAOKE-BAFFLE-WITH-AMPLIFIER') {
            const type = item.dataset.crowntype || 'all';
            if (activeCrownFilter === 'all' || type === activeCrownFilter) {
              item.classList.remove('d-none');
            } else {
              item.classList.add('d-none');
            }
          } else {
            item.classList.remove('d-none');
          }
        });
      });
      applySort(sortSelect.value);
    }
  });

  // ----- View Detail Buttons (Modal) -----
  document.querySelectorAll('.view-detail').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const card = this.closest('.product-item');
      populateModal(card);
    });
  });

  // Also handle dynamic view buttons (for products added later)
  const modalObserver = new MutationObserver(function() {
    document.querySelectorAll('.view-detail:not([data-listener])').forEach(btn => {
      btn.setAttribute('data-listener', 'true');
      btn.addEventListener('click', function(e) {
        const card = this.closest('.product-item');
        populateModal(card);
      });
    });
  });
  modalObserver.observe(document.body, { childList: true, subtree: true });

  // ============================================================
  //  INITIALIZE
  // ============================================================
  applyFilter('all');
  applyMicroFilter('all');
  applyCrownFilter('all');

  console.log('✅ Product Filter System Initialized');
  console.log(`📦 ${allProductItems.length} total products loaded`);

})();