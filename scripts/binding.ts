class ListBinding {
	public onRemove(element: HTMLElement) {
		const itemElement = element.parentElement;
		if (itemElement == null) {
			console.error(`No item element for '${element.id}'.`);
			return;
		}
		const removedElementIndex = this.getIndex(itemElement);
		if (removedElementIndex == null) {
			console.error(`No index found for '${itemElement.id}'`);
			return;
		}
		const collectionElement = itemElement.parentElement;
		if (collectionElement == null) {
			console.error(`No collection element for '${element.id}'.`);
			return;
		}
		collectionElement.removeChild(itemElement);
		this.decreaseNextIndexes(collectionElement, removedElementIndex);
	}

	public onAdd(element: HTMLElement) {
		const parentElement = element.parentElement;
		if (parentElement == null) {
			console.error(`No parent element for '${element.id}'.`);
			return;
		}
		const placeholderElement = this.getPlaceholder(parentElement);
		if (placeholderElement == null) {
			return;
		}
		const maxIndex = this.getMaxIndex(parentElement);
		const newIndex = maxIndex + 1;
		const newElement = this.clonePlaceholder(placeholderElement);
		parentElement.appendChild(newElement);
		this.updatePlaceholder(newElement, newIndex);
		parentElement.appendChild(element);
	}

	getPlaceholder(collectionElement: HTMLElement): HTMLElement | null {
		const collectionType = collectionElement.dataset["collectionType"];
		const placeholderId = `${collectionType}_Placeholder`;
		const placeholderElement = document.getElementById(placeholderId);
		if (placeholderElement == null) {
			console.error(`No placeholder element with id '${placeholderId}'.`);
		}
		return placeholderElement;
	}

	getMaxIndex(collectionElement: HTMLElement): number {
		const children = collectionElement.children;
		const indexes: number[] = [];
		for (let i = 0; i < children.length; i++) {
			const child = children.item(i) as HTMLElement;
			if (child == null) {
				continue;
			}
			const index = this.getIndex(child);
			if (index == null) {
				continue;
			}
			indexes.push(index);
		}
		if (indexes.length == 0) {
			return -1;
		}
		return Math.max.apply(null, indexes);
	}

	getIndex(element: HTMLElement): number | null {
		const indexStr = element.dataset["index"];
		if (indexStr == null) {
			return null;
		}
		return Number.parseInt(indexStr);
	}

	clonePlaceholder(placeholderElement: HTMLElement): HTMLElement {
		return placeholderElement.cloneNode(true) as HTMLElement;
	}

	updatePlaceholder(newElement: HTMLElement, newIndex: number) {
		newElement.removeAttribute("style");
		newElement.removeAttribute("id");
		this.updateChildIndex(newElement, '$', newIndex.toString());
	}

	updateChildIndex(element: HTMLElement, oldIndexStr: string, newIndexStr: string) {
		const label = element as HTMLLabelElement;
		if ((element.children.length == 0) && (label != null) && (label.textContent != null)) {
			label.textContent = label.textContent.replace(oldIndexStr, newIndexStr);
		}
		const attrs = element.attributes;
		for (let i = 0; i < attrs.length; i++) {
			const attr = attrs.item(i);
			if (attr == null) {
				continue;
			}
			attr.value = attr.value.replace(oldIndexStr, newIndexStr);
		}
		const children = element.children;
		for (let i = 0; i < children.length; i++) {
			const child = children.item(i) as HTMLElement;
			if (child == null) {
				continue;
			}
			this.updateChildIndex(child, oldIndexStr, newIndexStr);
		}
	}

	decreaseNextIndexes(parentElement: HTMLElement, removedElementIndex: number) {
		const children = parentElement.children;
		for (let i = 0; i < children.length; i++) {
			const child = children.item(i) as HTMLElement;
			if (child == null) {
				continue;
			}
			const index = this.getIndex(child);
			if (index == null) {
				continue;
			}
			if (index > removedElementIndex) {
				this.updateChildIndex(child, index.toString(), (index - 1).toString());
			}
		}
	}
}

const listBinding = new ListBinding();